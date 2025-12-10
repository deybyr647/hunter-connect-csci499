const courseList = [
    //  100-LEVEL COURSES
    { label: "🧩 100-Level Courses", value: "100level", selectable: false },
    {
        label: "CSCI 12100: Computers & Money: Quantitative Reasoning in Context",
        value: "CSCI 12100",
        parent: "100level",
    },
    {
        label: "CSCI 12700: Introduction to Computer Science",
        value: "CSCI 12700",
        parent: "100level",
    },
    {
        label: "CSCI 13200: Practical UNIX and Programming with Lab",
        value: "CSCI 13200",
        parent: "100level",
    },
    {
        label: "CSCI 13300: Programming for Everyone",
        value: "CSCI 13300",
        parent: "100level",
    },
    {
        label: "CSCI 13500: Software Analysis and Design I",
        value: "CSCI 13500",
        parent: "100level",
    },
    {
        label: "CSCI 13600: Supervised Programming Lab",
        value: "CSCI 13600",
        parent: "100level",
    },
    {
        label: "CSCI 15000: Discrete Structures",
        value: "CSCI 15000",
        parent: "100level",
    },
    {
        label: "CSCI 16000: Computer Architecture I",
        value: "CSCI 16000",
        parent: "100level",
    },
    {
        label: "CSCI 17200: Topics in Creative Problem Solving",
        value: "CSCI 17200",
        parent: "100level",
    },
    {
        label: "CSCI 18100: Independent Workshop",
        value: "CSCI 18100",
        parent: "100level",
    },
    {
        label: "CSCI 18200: Independent Workshop",
        value: "CSCI 18200",
        parent: "100level",
    },
    {
        label: "CSCI 18300: Independent Workshop",
        value: "CSCI 18300",
        parent: "100level",
    },

    //  200-LEVEL COURSES
    { label: "⚙️ 200-Level Courses", value: "200level", selectable: false },
    {
        label: "CSCI 22700: Programming Methods",
        value: "CSCI 22700",
        parent: "200level",
    },
    {
        label: "CSCI 23200: Relational Databases and SQL Programming with Lab",
        value: "CSCI 23200",
        parent: "200level",
    },
    {
        label: "CSCI 23300: Programming Projects Seminar for Minors",
        value: "CSCI 23300",
        parent: "200level",
    },
    {
        label: "CSCI 23500: Software Analysis and Design II",
        value: "CSCI 23500",
        parent: "200level",
    },
    {
        label: "CSCI 26000: Computer Architecture II",
        value: "CSCI 26000",
        parent: "200level",
    },
    {
        label: "CSCI 26500: Computer Theory I",
        value: "CSCI 26500",
        parent: "200level",
    },
    {
        label: "CSCI 26700: Microprocessing and Embedded Systems",
        value: "CSCI 26700",
        parent: "200level",
    },
    {
        label: "CSCI 27500: Symbolic Logic",
        value: "CSCI 27500",
        parent: "200level",
    },

    //  300-LEVEL COURSES
    { label: "💻 300-Level Courses", value: "300level", selectable: false },
    {
        label: "CSCI 32000: Artificial Intelligence",
        value: "CSCI 32000",
        parent: "300level",
    },
    {
        label: "CSCI 33500: Software Analysis and Design III",
        value: "CSCI 33500",
        parent: "300level",
    },
    {
        label: "CSCI 34000: Operating Systems",
        value: "CSCI 34000",
        parent: "300level",
    },
    {
        label: "CSCI 35000: Artificial Intelligence",
        value: "CSCI 35000",
        parent: "300level",
    },
    {
        label: "CSCI 35300: Machine Learning",
        value: "CSCI 35300",
        parent: "300level",
    },
    {
        label: "CSCI 35500: Introduction to Linear Programming",
        value: "CSCI 35500",
        parent: "300level",
    },
    {
        label: "CSCI 36000: Computer Architecture III",
        value: "CSCI 36000",
        parent: "300level",
    },
    {
        label: "CSCI 36500: Computer Theory II",
        value: "CSCI 36500",
        parent: "300level",
    },
    {
        label: "CSCI 37100: Advanced Symbolic Logic",
        value: "CSCI 37100",
        parent: "300level",
    },
    {
        label: "CSCI 37200: Logic and Computers",
        value: "CSCI 37200",
        parent: "300level",
    },
    {
        label: "CSCI 37700: Non-Classical Logic",
        value: "CSCI 37700",
        parent: "300level",
    },
    {
        label: "CSCI 38500: Numerical Methods I",
        value: "CSCI 38500",
        parent: "300level",
    },
    {
        label: "CSCI 39100: Independent Study I",
        value: "CSCI 39100",
        parent: "300level",
    },
    {
        label: "CSCI 39200: Independent Study II",
        value: "CSCI 39200",
        parent: "300level",
    },
    {
        label: "CSCI 39300: Independent Study III",
        value: "CSCI 39300",
        parent: "300level",
    },
    {
        label: "CSCI 39500–39900: Topics in Computer Science",
        value: "CSCI 39500-39900",
        parent: "300level",
    },

    //  400-LEVEL COURSES
    { label: "🧠 400-Level Courses", value: "400level", selectable: false },
    {
        label: "CSCI 40500: Software Engineering",
        value: "CSCI 40500",
        parent: "400level",
    },
    {
        label: "CSCI 41500: Data Communications and Networks",
        value: "CSCI 41500",
        parent: "400level",
    },
    {
        label: "CSCI 43500: Database Management Systems",
        value: "CSCI 43500",
        parent: "400level",
    },
    {
        label: "CSCI 46000: Advanced Programming Languages",
        value: "CSCI 46000",
        parent: "400level",
    },
    {
        label: "CSCI 49101: Logic Basis of Programming",
        value: "CSCI 49101",
        parent: "400level",
    },
    {
        label: "CSCI 49201: Functional Programming in OCaml",
        value: "CSCI 49201",
        parent: "400level",
    },
    {
        label: "CSCI 49300–49399: Seminars and Advanced Topics",
        value: "CSCI 49300-49399",
        parent: "400level",
    },
    {
        label: "CSCI 49600: Supervised Research I",
        value: "CSCI 49600",
        parent: "400level",
    },
    {
        label: "CSCI 49700: Supervised Research II",
        value: "CSCI 49700",
        parent: "400level",
    },
    {
        label: "CSCI 49800: Supervised Research III",
        value: "CSCI 49800",
        parent: "400level",
    },
    {
        label: "CSCI 49900: Advanced Applications: A Capstone for Majors",
        value: "CSCI 49900",
        parent: "400level",
    },
];

const skillList = [
    //  PROGRAMMING LANGUAGES (parent)
    {
        label: "🧠 Programming Languages",
        value: "languages",
        selectable: false,
    },
    { label: "Python", value: "Python", parent: "languages" },
    { label: "Java", value: "Java", parent: "languages" },
    { label: "C", value: "C", parent: "languages" },
    { label: "C++", value: "C++", parent: "languages" },
    { label: "C#", value: "C#", parent: "languages" },
    { label: "JavaScript", value: "JavaScript", parent: "languages" },
    { label: "TypeScript", value: "TypeScript", parent: "languages" },
    { label: "HTML", value: "HTML", parent: "languages" },
    { label: "CSS", value: "CSS", parent: "languages" },
    { label: "SQL", value: "SQL", parent: "languages" },
    { label: "NoSQL", value: "NoSQL", parent: "languages" },
    { label: "Bash/Shell", value: "Bash/Shell", parent: "languages" },
    { label: "R", value: "R", parent: "languages" },
    { label: "Go", value: "Go", parent: "languages" },
    { label: "Swift", value: "Swift", parent: "languages" },
    { label: "Kotlin", value: "Kotlin", parent: "languages" },
    { label: "Ruby", value: "Ruby", parent: "languages" },
    { label: "MATLAB", value: "MATLAB", parent: "languages" },
    { label: "Rust", value: "Rust", parent: "languages" },
    { label: "Assembly", value: "Assembly", parent: "languages" },

    //  FRAMEWORKS & LIBRARIES
    {
        label: "⚙️ Frameworks & Libraries",
        value: "frameworks",
        selectable: false,
    },
    { label: "React", value: "React", parent: "frameworks" },
    { label: "React Native", value: "React Native", parent: "frameworks" },
    { label: "Node.js", value: "Node.js", parent: "frameworks" },
    { label: "Express.js", value: "Express.js", parent: "frameworks" },
    { label: "Next.js", value: "Next.js", parent: "frameworks" },
    { label: "Django", value: "Django", parent: "frameworks" },
    { label: "Flask", value: "Flask", parent: "frameworks" },
    { label: "Spring Boot", value: "Spring Boot", parent: "frameworks" },
    { label: "Angular", value: "Angular", parent: "frameworks" },
    { label: "Vue.js", value: "Vue.js", parent: "frameworks" },
    { label: "Tailwind CSS", value: "Tailwind CSS", parent: "frameworks" },
    { label: "Bootstrap", value: "Bootstrap", parent: "frameworks" },
    { label: "Pandas", value: "Pandas", parent: "frameworks" },
    { label: "NumPy", value: "NumPy", parent: "frameworks" },
    { label: "Matplotlib", value: "Matplotlib", parent: "frameworks" },
    { label: "TensorFlow", value: "TensorFlow", parent: "frameworks" },
    { label: "PyTorch", value: "PyTorch", parent: "frameworks" },
    { label: "Scikit-learn", value: "Scikit-learn", parent: "frameworks" },
    { label: "OpenCV", value: "OpenCV", parent: "frameworks" },
    { label: "Firebase", value: "Firebase", parent: "frameworks" },
    { label: "MongoDB", value: "MongoDB", parent: "frameworks" },
    { label: "PostgreSQL", value: "PostgreSQL", parent: "frameworks" },
    { label: "MySQL", value: "MySQL", parent: "frameworks" },

    //  CLOUD, DEVOPS & TOOLS
    { label: "☁️ Cloud, DevOps & Tools", value: "devops", selectable: false },
    { label: "Git", value: "Git", parent: "devops" },
    { label: "GitHub", value: "GitHub", parent: "devops" },
    { label: "Docker", value: "Docker", parent: "devops" },
    { label: "Kubernetes", value: "Kubernetes", parent: "devops" },
    { label: "AWS", value: "AWS", parent: "devops" },
    {
        label: "Google Cloud Platform",
        value: "Google Cloud Platform",
        parent: "devops",
    },
    { label: "Microsoft Azure", value: "Microsoft Azure", parent: "devops" },
    { label: "Linux", value: "Linux", parent: "devops" },
    { label: "Unix", value: "Unix", parent: "devops" },
    { label: "CI/CD", value: "CI/CD", parent: "devops" },
    { label: "REST APIs", value: "REST APIs", parent: "devops" },
    { label: "GraphQL", value: "GraphQL", parent: "devops" },
    { label: "JSON", value: "JSON", parent: "devops" },
    { label: "Postman", value: "Postman", parent: "devops" },
    { label: "Figma", value: "Figma", parent: "devops" },
    { label: "VS Code", value: "VS Code", parent: "devops" },
    { label: "Vim", value: "Vim", parent: "devops" },
    {
        label: "Agile Development",
        value: "Agile Development",
        parent: "devops",
    },
    { label: "Scrum", value: "Scrum", parent: "devops" },
    { label: "Unit Testing", value: "Unit Testing", parent: "devops" },
    { label: "Jest", value: "Jest", parent: "devops" },
    { label: "Mocha", value: "Mocha", parent: "devops" },
    { label: "Cypress", value: "Cypress", parent: "devops" },

    //  CORE CS CONCEPTS
    { label: "🧩 Core CS Concepts", value: "csconcepts", selectable: false },
    {
        label: "Data Structures",
        value: "Data Structures",
        parent: "csconcepts",
    },
    { label: "Algorithms", value: "Algorithms", parent: "csconcepts" },
    {
        label: "Object-Oriented Programming (OOP)",
        value: "OOP",
        parent: "csconcepts",
    },
    {
        label: "Functional Programming",
        value: "Functional Programming",
        parent: "csconcepts",
    },
    {
        label: "Database Design",
        value: "Database Design",
        parent: "csconcepts",
    },
    {
        label: "Software Engineering",
        value: "Software Engineering",
        parent: "csconcepts",
    },
    {
        label: "Operating Systems",
        value: "Operating Systems",
        parent: "csconcepts",
    },
    {
        label: "Computer Networks",
        value: "Computer Networks",
        parent: "csconcepts",
    },
    { label: "Cybersecurity", value: "Cybersecurity", parent: "csconcepts" },
    {
        label: "Parallel Computing",
        value: "Parallel Computing",
        parent: "csconcepts",
    },
    {
        label: "Distributed Systems",
        value: "Distributed Systems",
        parent: "csconcepts",
    },
    {
        label: "Compiler Design",
        value: "Compiler Design",
        parent: "csconcepts",
    },
    {
        label: "Cloud Computing",
        value: "Cloud Computing",
        parent: "csconcepts",
    },
    {
        label: "Systems Programming",
        value: "Systems Programming",
        parent: "csconcepts",
    },
    {
        label: "Embedded Systems",
        value: "Embedded Systems",
        parent: "csconcepts",
    },
    {
        label: "Software Testing",
        value: "Software Testing",
        parent: "csconcepts",
    },
    { label: "Debugging", value: "Debugging", parent: "csconcepts" },
    { label: "Automation", value: "Automation", parent: "csconcepts" },
    { label: "Data Analytics", value: "Data Analytics", parent: "csconcepts" },

    //  AI & ADVANCED TOPICS
    { label: "🤖 AI & Advanced Topics", value: "ai", selectable: false },
    { label: "Machine Learning", value: "Machine Learning", parent: "ai" },
    { label: "Deep Learning", value: "Deep Learning", parent: "ai" },
    {
        label: "Artificial Intelligence",
        value: "Artificial Intelligence",
        parent: "ai",
    },
    { label: "Natural Language Processing (NLP)", value: "NLP", parent: "ai" },
    { label: "Computer Vision", value: "Computer Vision", parent: "ai" },
    { label: "Data Science", value: "Data Science", parent: "ai" },
    { label: "Data Visualization", value: "Data Visualization", parent: "ai" },
    { label: "Big Data", value: "Big Data", parent: "ai" },
    { label: "Blockchain", value: "Blockchain", parent: "ai" },
    { label: "Cryptography", value: "Cryptography", parent: "ai" },

    //  DEVELOPMENT & DESIGN
    { label: "🎮 Development & Design", value: "devdesign", selectable: false },
    { label: "Web Development", value: "Web Development", parent: "devdesign" },
    {
        label: "Mobile App Development",
        value: "Mobile App Development",
        parent: "devdesign",
    },
    {
        label: "Game Development",
        value: "Game Development",
        parent: "devdesign",
    },
    { label: "UI/UX Design", value: "UI/UX Design", parent: "devdesign" },
    { label: "Product Design", value: "Product Design", parent: "devdesign" },
    {
        label: "Human-Computer Interaction",
        value: "Human-Computer Interaction",
        parent: "devdesign",
    },
    { label: "Version Control", value: "Version Control", parent: "devdesign" },

    //  PROFESSIONAL & RESEARCH
    {
        label: "🧰 Professional & Research",
        value: "proskills",
        selectable: false,
    },
    {
        label: "Technical Writing",
        value: "Technical Writing",
        parent: "proskills",
    },
    { label: "Research", value: "Research", parent: "proskills" },
    { label: "Collaboration", value: "Collaboration", parent: "proskills" },
    { label: "Problem Solving", value: "Problem Solving", parent: "proskills" },
    {
        label: "Critical Thinking",
        value: "Critical Thinking",
        parent: "proskills",
    },
    {
        label: "Project Management",
        value: "Project Management",
        parent: "proskills",
    },
    { label: "Time Management", value: "Time Management", parent: "proskills" },
    {
        label: "Technical Communication",
        value: "Technical Communication",
        parent: "proskills",
    },
];

const interestList = [
    //  ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
    {
        label: "🤖 Artificial Intelligence & Machine Learning",
        value: "ai",
        selectable: false,
    },
    {
        label: "Artificial Intelligence",
        value: "Artificial Intelligence",
        parent: "ai",
    },
    { label: "Machine Learning", value: "Machine Learning", parent: "ai" },
    { label: "Deep Learning", value: "Deep Learning", parent: "ai" },
    { label: "Natural Language Processing (NLP)", value: "NLP", parent: "ai" },
    { label: "Computer Vision", value: "Computer Vision", parent: "ai" },
    {
        label: "Reinforcement Learning",
        value: "Reinforcement Learning",
        parent: "ai",
    },
    { label: "Robotics", value: "Robotics", parent: "ai" },
    { label: "AI Ethics", value: "AI Ethics", parent: "ai" },

    //  WEB & APP DEVELOPMENT
    { label: "🌐 Web & App Development", value: "webdev", selectable: false },
    {
        label: "Frontend Development",
        value: "Frontend Development",
        parent: "webdev",
    },
    {
        label: "Backend Development",
        value: "Backend Development",
        parent: "webdev",
    },
    {
        label: "Full-Stack Development",
        value: "Full-Stack Development",
        parent: "webdev",
    },
    {
        label: "Mobile App Development",
        value: "Mobile App Development",
        parent: "webdev",
    },
    {
        label: "Progressive Web Apps",
        value: "Progressive Web Apps",
        parent: "webdev",
    },
    {
        label: "Web Performance Optimization",
        value: "Web Performance Optimization",
        parent: "webdev",
    },
    { label: "UI/UX Design", value: "UI/UX Design", parent: "webdev" },
    {
        label: "Accessibility (A11y)",
        value: "Accessibility (A11y)",
        parent: "webdev",
    },

    //  DATA, ANALYTICS & SCIENCE
    {
        label: "🧠 Data, Analytics & Science",
        value: "datasci",
        selectable: false,
    },
    { label: "Data Science", value: "Data Science", parent: "datasci" },
    { label: "Data Analysis", value: "Data Analysis", parent: "datasci" },
    {
        label: "Data Visualization",
        value: "Data Visualization",
        parent: "datasci",
    },
    { label: "Big Data", value: "Big Data", parent: "datasci" },
    {
        label: "Business Intelligence",
        value: "Business Intelligence",
        parent: "datasci",
    },
    { label: "Data Engineering", value: "Data Engineering", parent: "datasci" },
    {
        label: "Cloud Data Systems",
        value: "Cloud Data Systems",
        parent: "datasci",
    },

    //  CYBERSECURITY & PRIVACY
    {
        label: "🔐 Cybersecurity & Privacy",
        value: "security",
        selectable: false,
    },
    { label: "Cybersecurity", value: "Cybersecurity", parent: "security" },
    {
        label: "Network Security",
        value: "Network Security",
        parent: "security",
    },
    { label: "Cloud Security", value: "Cloud Security", parent: "security" },
    {
        label: "Penetration Testing",
        value: "Penetration Testing",
        parent: "security",
    },
    {
        label: "Digital Forensics",
        value: "Digital Forensics",
        parent: "security",
    },
    { label: "Cryptography", value: "Cryptography", parent: "security" },
    {
        label: "Privacy Engineering",
        value: "Privacy Engineering",
        parent: "security",
    },
    { label: "Ethical Hacking", value: "Ethical Hacking", parent: "security" },

    //  SYSTEMS, HARDWARE & ENGINEERING
    {
        label: "⚙️ Systems, Hardware & Engineering",
        value: "systems",
        selectable: false,
    },
    {
        label: "Operating Systems",
        value: "Operating Systems",
        parent: "systems",
    },
    {
        label: "Computer Architecture",
        value: "Computer Architecture",
        parent: "systems",
    },
    { label: "Embedded Systems", value: "Embedded Systems", parent: "systems" },
    { label: "Networking", value: "Networking", parent: "systems" },
    {
        label: "Parallel Computing",
        value: "Parallel Computing",
        parent: "systems",
    },
    {
        label: "Distributed Systems",
        value: "Distributed Systems",
        parent: "systems",
    },
    { label: "Cloud Computing", value: "Cloud Computing", parent: "systems" },
    { label: "Internet of Things (IoT)", value: "IoT", parent: "systems" },

    //  GAMES, MEDIA & INTERACTION
    {
        label: "🎮 Games, Media & Interaction",
        value: "games",
        selectable: false,
    },
    { label: "Game Development", value: "Game Development", parent: "games" },
    { label: "Game Design", value: "Game Design", parent: "games" },
    { label: "Augmented Reality (AR)", value: "AR", parent: "games" },
    { label: "Virtual Reality (VR)", value: "VR", parent: "games" },
    { label: "Mixed Reality (MR)", value: "MR", parent: "games" },
    { label: "Computer Graphics", value: "Computer Graphics", parent: "games" },
    { label: "3D Modeling", value: "3D Modeling", parent: "games" },
    { label: "Animation", value: "Animation", parent: "games" },
    { label: "Human-Computer Interaction", value: "HCI", parent: "games" },

    //  SOFTWARE DEVELOPMENT & ENGINEERING
    {
        label: "💼 Software Development & Engineering",
        value: "software",
        selectable: false,
    },
    {
        label: "Software Engineering",
        value: "Software Engineering",
        parent: "software",
    },
    {
        label: "Agile Development",
        value: "Agile Development",
        parent: "software",
    },
    { label: "DevOps", value: "DevOps", parent: "software" },
    {
        label: "Software Testing",
        value: "Software Testing",
        parent: "software",
    },
    { label: "Version Control", value: "Version Control", parent: "software" },
    {
        label: "Technical Writing",
        value: "Technical Writing",
        parent: "software",
    },
    {
        label: "Open Source Contribution",
        value: "Open Source Contribution",
        parent: "software",
    },
    {
        label: "Cloud Deployment",
        value: "Cloud Deployment",
        parent: "software",
    },

    //  THEORY, RESEARCH & MATH FOUNDATIONS
    {
        label: "📊 Theory, Research & Math Foundations",
        value: "theory",
        selectable: false,
    },
    { label: "Algorithms", value: "Algorithms", parent: "theory" },
    { label: "Data Structures", value: "Data Structures", parent: "theory" },
    {
        label: "Computational Theory",
        value: "Computational Theory",
        parent: "theory",
    },
    {
        label: "Discrete Mathematics",
        value: "Discrete Mathematics",
        parent: "theory",
    },
    { label: "Formal Logic", value: "Formal Logic", parent: "theory" },
    {
        label: "Numerical Methods",
        value: "Numerical Methods",
        parent: "theory",
    },
    {
        label: "Quantum Computing",
        value: "Quantum Computing",
        parent: "theory",
    },
    {
        label: "Research & Academia",
        value: "Research & Academia",
        parent: "theory",
    },

    //  CAREER & INDUSTRY FOCUS
    { label: "💼 Career & Industry Focus", value: "career", selectable: false },
    { label: "Entrepreneurship", value: "Entrepreneurship", parent: "career" },
    { label: "Startups", value: "Startups", parent: "career" },
    {
        label: "Product Management",
        value: "Product Management",
        parent: "career",
    },
    { label: "Tech Consulting", value: "Tech Consulting", parent: "career" },
    {
        label: "Cloud Infrastructure",
        value: "Cloud Infrastructure",
        parent: "career",
    },
    { label: "FinTech", value: "FinTech", parent: "career" },
    { label: "HealthTech", value: "HealthTech", parent: "career" },
    { label: "EdTech", value: "EdTech", parent: "career" },
    { label: "Game Industry", value: "Game Industry", parent: "career" },
    { label: "AI Startups", value: "AI Startups", parent: "career" },
];

export { interestList, courseList, skillList };