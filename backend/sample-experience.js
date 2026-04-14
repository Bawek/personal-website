// Sample experience data based on your LinkedIn profile
const experienceData = [
  {
    title: 'Software Engineer',
    company: 'ALTA Computec PLC',
    location: 'Addis Ababa, Ethiopia',
    employmentType: 'full-time',
    startDate: '2025-12-01',
    endDate: null,
    current: true,
    description: 'Working as a Software Engineer responsible for designing, developing, and maintaining software solutions aligned with business and client requirements. Actively involved in full-stack development, backend services, and system integration using modern technologies.',
    responsibilities: [
      'Designing and developing scalable web applications',
      'Implementing secure APIs and backend services',
      'Managing relational databases and optimization',
      'Collaborating with cross-functional teams',
      'System analysis, debugging, and performance optimization',
      'Supporting deployment and maintenance of production systems',
      'Following secure coding standards and best practices'
    ],
    achievements: [
      'Contributed to AI-driven projects enhancing system efficiency',
      'Improved data integrity and application security',
      'Delivered reliable software systems for clients'
    ],
    technologies: ['Software Development', 'Artificial Intelligence (AI)', 'Full-stack Development', 'Database Design', 'Cybersecurity', 'API Development', 'System Integration']
  },
  {
    title: 'ICT Officer',
    company: 'KAKI Motors',
    location: 'Addis Ababa, Ethiopia',
    employmentType: 'full-time',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    current: false,
    description: 'Managed IT infrastructure and provided technical support for automotive company operations.',
    responsibilities: [
      'System administration and network management',
      'IT infrastructure maintenance',
      'Technical support and troubleshooting'
    ],
    achievements: [
      'Maintained 99% system uptime',
      'Improved IT response time by 40%'
    ],
    technologies: ['System Administration', 'Networking', 'IT Support']
  },
  {
    title: 'Web Developer',
    company: 'Debre Markos ICT Centre',
    location: 'Debre Markos, Ethiopia',
    employmentType: 'full-time',
    startDate: '2024-09-01',
    endDate: '2025-05-01',
    current: false,
    description: 'Collaborated with the team to develop and maintain internal web applications using the MERN stack.',
    responsibilities: [
      'Developed frontend components using React.js',
      'Built backend services with Node.js and Express',
      'Maintained and improved existing web applications',
      'Collaborated with team members on project development'
    ],
    achievements: [
      'Successfully delivered 5+ internal web applications',
      'Improved application performance by 30%'
    ],
    technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'MERN Stack']
  }
];

console.log('Your Experience Data Ready for Entry:');
console.log('=====================================');

experienceData.forEach((exp, index) => {
  console.log(`\n${index + 1}. ${exp.title} at ${exp.company}`);
  console.log(`   Duration: ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`);
  console.log(`   Technologies: ${exp.technologies.join(', ')}`);
});

function formatDate(dateString) {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

console.log('\n\nTo add these to your admin dashboard:');
console.log('1. Go to http://localhost:3000/admin/experience');
console.log('2. Fill in each experience using the data above');
console.log('3. Use the provided responsibilities, achievements, and technologies');
