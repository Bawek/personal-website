const axios = require('axios');

class LinkedInService {
  constructor() {
    this.baseURL = 'https://api.linkedin.com/v2';
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    this.personUrn = process.env.LINKEDIN_PERSON_URN;
  }

  // Post content to LinkedIn
  async postContent(content, imageUrl = null) {
    try {
      // Step 1: Create the post
      const postData = {
        author: this.personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      // Add image if provided
      if (imageUrl) {
        // First upload the image
        const imageUrn = await this.uploadImage(imageUrl);
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: {
              text: 'Check out this project!'
            },
            media: imageUrn,
            title: {
              text: 'New Project'
            }
          }
        ];
      }

      const response = await axios.post(`${this.baseURL}/ugcPosts`, postData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error posting to LinkedIn:', error.response?.data || error.message);
      throw error;
    }
  }

  // Upload image to LinkedIn
  async uploadImage(imageUrl) {
    try {
      // Register image upload
      const registerResponse = await axios.post(`${this.baseURL}/assets`, {
        registerUploadRequest: {
          recipes: [
            {
              recipe: 'com.linkedin.digitalmedia.mediaasset.UploadRecipe'
            }
          ],
          owner: this.personUrn,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:digitalmediaAsset:'
            }
          ]
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const uploadUrl = registerResponse.data.value.uploadMechanism[
        'com.linkedin.digitalmedia.mediaasset.UploadRecipe'
      ].uploadUrl;
      const assetUrn = registerResponse.data.value.asset;

      // Download and upload the image
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'stream'
      });

      await axios.put(uploadUrl, imageResponse.data, {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });

      return assetUrn;
    } catch (error) {
      console.error('Error uploading image to LinkedIn:', error);
      throw error;
    }
  }

  // Post about new project
  async postNewProject(project) {
    const content = `Excited to share my latest project: ${project.title}

${project.description}

Tech stack: ${project.techStack.join(', ')}

${project.githubUrl ? `Check it out on GitHub: ${project.githubUrl}` : ''}
${project.liveUrl ? `Live demo: ${project.liveUrl}` : ''}

#webdevelopment #programming #portfolio #newproject`;

    return await this.postContent(content, project.imageUrl);
  }

  // Post about new experience
  async postNewExperience(experience) {
    const content = `Thrilled to announce my new role as ${experience.title} at ${experience.company}!

${experience.description}

${experience.technologies.length > 0 ? `Working with: ${experience.technologies.join(', ')}` : ''}

#newjob #career #tech ${experience.technologies.map(tech => `#${tech.replace(/\s+/g, '')}`).join(' ')}`;

    return await this.postContent(content);
  }

  // Post about new blog/content
  async postNewContent(content) {
    const postText = `Just published: ${content.title}

${content.excerpt || content.description.substring(0, 200)}...

${process.env.FRONTEND_URL}/content/${content.slug}

#blog #writing #tech #knowledge ${content.tags ? content.tags.map(tag => `#${tag}`).join(' ') : ''}`;

    return await this.postContent(postText);
  }

  // Add new skill to LinkedIn profile
  async addSkill(skillName) {
    try {
      const postData = {
        skill: skillName
      };

      const response = await axios.post(`${this.baseURL}/people/${this.personUrn}/skills`, postData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error adding skill to LinkedIn:', error);
      throw error;
    }
  }
}

module.exports = LinkedInService;
