export interface SkillNode {
  id: string;
  label: string;
  category: 'languages' | 'frontend' | 'backend' | 'databases' | 'ai-data' | 'blockchain' | 'cloud' | 'tools';
  linkedProjects: string[]; // project ids where this skill was explicitly used per section 7
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    skills: ['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS'],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    skills: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    name: 'Backend',
    skills: ['Node.js', 'Express.js', 'Spring Boot', 'JSP', 'Servlets', 'JDBC'],
  },
  {
    id: 'databases',
    name: 'Databases',
    skills: ['MongoDB', 'MySQL', 'Firebase'],
  },
  {
    id: 'ai-data',
    name: 'AI and Data',
    skills: ['Machine Learning', 'LDA', 'NLP', 'Gemini API'],
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    skills: ['Hyperledger Fabric', 'Fabric CA', 'Docker'],
  },
  {
    id: 'cloud',
    name: 'Cloud and Deployment',
    skills: ['Vercel', 'Firebase', 'Render', 'Google Cloud'],
  },
  {
    id: 'tools',
    name: 'Tools',
    skills: ['Git', 'GitHub', 'Docker', 'Postman', 'Figma', 'VS Code', 'WSL'],
  },
];

export const constellationNodes: SkillNode[] = [
  // Languages
  { id: 'java', label: 'Java', category: 'languages', linkedProjects: [] },
  { id: 'javascript', label: 'JavaScript', category: 'languages', linkedProjects: ['headlyn'] },
  { id: 'typescript', label: 'TypeScript', category: 'languages', linkedProjects: [] },
  { id: 'python', label: 'Python', category: 'languages', linkedProjects: ['edge-topic-modelling'] },
  { id: 'sql', label: 'SQL', category: 'languages', linkedProjects: [] },
  { id: 'html', label: 'HTML', category: 'languages', linkedProjects: [] },
  { id: 'css', label: 'CSS', category: 'languages', linkedProjects: [] },

  // Frontend
  { id: 'react', label: 'React', category: 'frontend', linkedProjects: ['assignmate', 'headlyn'] },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', linkedProjects: [] },
  { id: 'vite', label: 'Vite', category: 'frontend', linkedProjects: [] },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', linkedProjects: ['assignmate'] },

  // Backend
  { id: 'nodejs', label: 'Node.js', category: 'backend', linkedProjects: ['assignmate'] },
  { id: 'express', label: 'Express.js', category: 'backend', linkedProjects: ['assignmate'] },
  { id: 'springboot', label: 'Spring Boot', category: 'backend', linkedProjects: [] },
  { id: 'jsp', label: 'JSP', category: 'backend', linkedProjects: [] },
  { id: 'servlets', label: 'Servlets', category: 'backend', linkedProjects: [] },
  { id: 'jdbc', label: 'JDBC', category: 'backend', linkedProjects: [] },

  // Databases
  { id: 'mongodb', label: 'MongoDB', category: 'databases', linkedProjects: [] },
  { id: 'mysql', label: 'MySQL', category: 'databases', linkedProjects: [] },
  { id: 'firebase', label: 'Firebase', category: 'databases', linkedProjects: [] },

  // AI & Data
  { id: 'ml', label: 'Machine Learning', category: 'ai-data', linkedProjects: [] },
  { id: 'lda', label: 'LDA', category: 'ai-data', linkedProjects: ['edge-topic-modelling'] },
  { id: 'nlp', label: 'NLP', category: 'ai-data', linkedProjects: ['edge-topic-modelling'] },
  { id: 'gemini', label: 'Gemini API', category: 'ai-data', linkedProjects: ['assignmate'] },

  // Blockchain
  { id: 'hyperledger', label: 'Hyperledger Fabric', category: 'blockchain', linkedProjects: ['honey-chain'] },
  { id: 'fabric-ca', label: 'Fabric CA', category: 'blockchain', linkedProjects: ['honey-chain'] },

  // Cloud & Deployment
  { id: 'vercel', label: 'Vercel', category: 'cloud', linkedProjects: ['headlyn'] },
  { id: 'render', label: 'Render', category: 'cloud', linkedProjects: [] },
  { id: 'gcp', label: 'Google Cloud', category: 'cloud', linkedProjects: [] },

  // Tools
  { id: 'git', label: 'Git', category: 'tools', linkedProjects: [] },
  { id: 'github', label: 'GitHub', category: 'tools', linkedProjects: [] },
  { id: 'docker', label: 'Docker', category: 'tools', linkedProjects: ['honey-chain'] },
  { id: 'postman', label: 'Postman', category: 'tools', linkedProjects: ['assignmate'] },
  { id: 'figma', label: 'Figma', category: 'tools', linkedProjects: [] },
  { id: 'vscode', label: 'VS Code', category: 'tools', linkedProjects: [] },
  { id: 'wsl', label: 'WSL', category: 'tools', linkedProjects: ['honey-chain'] },
];
