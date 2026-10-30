// Default text of the website. The administrator can change all of it from /admin.
export const DEFAULTS = {
  name: 'Grace Magdalene Wanza',
  profession: 'ICT Student',
  tagline: 'ICT student passionate about web development, cybersecurity and using technology to solve real-world problems.',
  vision: 'To become a skilled and responsible ICT professional who uses technology to create innovative, secure and accessible solutions that improve lives and strengthen communities.',
  mission: 'To keep learning, build practical skills in web development, networking, databases and cybersecurity, and apply them with integrity and creativity to solve real-world problems.',
  about: "My name is Grace Magdalene Wanza, and I am an Information and Communication Technology (ICT) student with a strong interest in technology, computer systems, web development, and cybersecurity. I am passionate about learning how technology works and how it can be used to solve real-world problems. Through my studies, I am developing the technical knowledge and practical skills needed to work in the ICT industry.\n\nI am a hardworking, self-motivated, and creative individual who enjoys learning new things and taking on challenges. I believe that continuous learning, determination, and problem-solving are essential for success in the technology field. I am always willing to improve my skills, explore new ideas, and gain practical experience that will help me grow both personally and professionally.",
  education: 'I am pursuing studies in Information and Communication Technology, where I am gaining knowledge of computer applications, programming, networking, database management, and website development. My studies have helped me understand the importance of technology in communication, business, education, and everyday life.',
  interests: "Web Development | Creating attractive, responsive, and user-friendly websites using HTML, CSS, JavaScript, PHP, and MySQL.\nCybersecurity | Learning how to protect computer systems, networks, and information from security threats.\nNetworking | Understanding how computers communicate and share resources.\nDatabase Management | Learning how to store, organize, retrieve, and manage information efficiently.\nTechnical Support | Troubleshooting computer problems and helping users solve technical challenges.",
  skills_text: 'Through my studies and personal practice, I am developing skills in computer applications, website design, programming fundamentals, database management, networking concepts, and problem-solving. I am also improving my communication, teamwork, time-management, and critical-thinking skills.',
  skills: "HTML | Building the structure of web pages.\nCSS | Styling responsive and attractive layouts.\nJavaScript | Adding interactivity to websites.\nPHP | Server-side programming for dynamic websites.\nMySQL | Designing and managing databases.\nNetworking | Understanding how computers communicate and share resources.\nCybersecurity | Protecting systems and information from threats.\nComputer applications | Using office and productivity software.\nProblem-solving | Breaking challenges down and finding solutions.\nCommunication | Explaining ideas clearly.\nTeamwork | Working well with others.\nTime management | Planning work and meeting deadlines.",
  goals: "My goal is to become a competent ICT professional who can use technology to develop innovative solutions and make a positive contribution to society. I aspire to gain practical experience, continue improving my technical skills, and build a successful career in web development, cybersecurity, or another area of ICT.\n\nI believe that every new skill I learn brings me closer to achieving my dreams. I am committed to working hard, embracing new opportunities, and growing into a knowledgeable and responsible technology professional.",
  motto: 'Every challenge is an opportunity to learn, every skill is a step forward, and every day is a chance to become better than yesterday.',
  email: 'gracemagdalene5@gmail.com',
  linkedin: 'https://www.linkedin.com/in/magdalene-grace-2460b73a8',
  github: '',
};

// Fields shown in Admin > Page content
export const FIELDS = [
  { key: 'name', label: 'Your name', type: 'input' },
  { key: 'profession', label: 'Profession (shown on the Home page)', type: 'input' },
  { key: 'tagline', label: 'Home page introduction', type: 'input' },
  { key: 'vision', label: 'Vision', type: 'textarea', rows: 3 },
  { key: 'mission', label: 'Mission', type: 'textarea', rows: 4 },
  { key: 'about', label: 'About me / background (leave a blank line between paragraphs)', type: 'textarea', rows: 9 },
  { key: 'education', label: 'My ICT course (Education page)', type: 'textarea', rows: 4 },
  { key: 'interests', label: 'ICT interests (one per line, written as: Title | description)', type: 'textarea', rows: 7 },
  { key: 'skills_text', label: 'Skills paragraph', type: 'textarea', rows: 4 },
  { key: 'skills', label: 'Skills (one per line, written as: Skill | short description)', type: 'textarea', rows: 12 },
  { key: 'goals', label: 'Professional objectives (leave a blank line between paragraphs)', type: 'textarea', rows: 7 },
  { key: 'motto', label: 'Personal motto', type: 'textarea', rows: 2 },
  { key: 'email', label: 'Contact email', type: 'input' },
  { key: 'linkedin', label: 'LinkedIn link', type: 'input' },
  { key: 'github', label: 'GitHub link (optional)', type: 'input' },
];

export const lines = (t = '') => String(t).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
export const paras = (t = '') => String(t).split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
export const split2 = (ln) => { const i = ln.indexOf('|'); return i < 0 ? [ln.trim(), ''] : [ln.slice(0, i).trim(), ln.slice(i + 1).trim()]; };
export function initials(name = '') {
  const w = String(name).trim().split(/\s+/); const a = w[0] || ''; const b = w[w.length - 1] || '';
  return (a.charAt(0) + (b !== a ? b.charAt(0) : '')).toUpperCase();
}
