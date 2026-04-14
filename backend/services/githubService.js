const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
  }

  // Get user's repositories
  async getUserRepos(username) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      throw error;
    }
  }

  // Get repository details
  async getRepoDetails(owner, repo) {
    try {
      const [repoData, languagesData, readmeData] = await Promise.all([
        axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
          headers: { 'Authorization': `token ${this.token}` }
        }),
        axios.get(`${this.baseURL}/repos/${owner}/${repo}/languages`, {
          headers: { 'Authorization': `token ${this.token}` }
        }),
        axios.get(`${this.baseURL}/repos/${owner}/${repo}/readme`, {
          headers: { 'Authorization': `token ${this.token}` }
        })
      ]);

      return {
        ...repoData.data,
        languages: Object.keys(languagesData.data),
        readme: readmeData.data
      };
    } catch (error) {
      console.error('Error fetching repo details:', error);
      throw error;
    }
  }

  // Sync repositories with local projects
  async syncRepositories(username, userId) {
    try {
      const repos = await this.getUserRepos(username);
      const Project = require('../models/Project');
      
      for (const repo of repos) {
        // Check if project already exists
        const existingProject = await Project.findOne({
          githubUrl: repo.html_url,
          createdBy: userId
        });

        if (!existingProject) {
          // Create new project from GitHub repo
          const repoDetails = await this.getRepoDetails(repo.owner.login, repo.name);
          
          const projectData = {
            title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: repo.description || `A ${repo.language} project`,
            techStack: repoDetails.languages || [repo.language].filter(Boolean),
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || '',
            imageUrl: repo.owner.avatar_url,
            featured: false,
            createdBy: userId
          };

          const project = new Project(projectData);
          await project.save();
          console.log(`Synced project: ${repo.name}`);
        }
      }

      return { success: true, synced: repos.length };
    } catch (error) {
      console.error('Error syncing repositories:', error);
      throw error;
    }
  }

  // Webhook handler for repository events
  async handleWebhook(payload) {
    const Project = require('../models/Project');
    
    switch (payload.action) {
      case 'created':
        // New repository created
        await this.createProjectFromRepo(payload.repository);
        break;
      case 'push':
        // Repository updated - could trigger a sync/update
        await this.updateProjectFromRepo(payload.repository);
        break;
      default:
        console.log(`Unhandled GitHub webhook action: ${payload.action}`);
    }
  }

  async createProjectFromRepo(repo) {
    const Project = require('../models/Project');
    // This would need to be implemented based on your user identification logic
    console.log('New repo created:', repo.name);
  }

  async updateProjectFromRepo(repo) {
    const Project = require('../models/Project');
    // Update existing project with latest repo data
    console.log('Repo updated:', repo.name);
  }
}

module.exports = GitHubService;
