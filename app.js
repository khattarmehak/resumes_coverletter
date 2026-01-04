const { useState } = React;

function ResumeGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [copied, setCopied] = useState({ resume: false, cover: false });
  const [error, setError] = useState('');
  const [missingInfo, setMissingInfo] = useState([]);
  const [showInfoPrompt, setShowInfoPrompt] = useState(false);

  const masterContent = {
    name: "MEHAK KHATTAR, C.M.",
    contact: "khattarmehak1@gmail.com | 416.893.1395 | Mehak Khattar | LinkedIn",
    professionalProfile: "Creative and data-savvy social media leader with 4+ years of experience blending entertainment and marketing to drive growth across TikTok, Instagram, LinkedIn, YouTube, and more. Proven track record leading UGC campaigns, managing creator platforms, and delivering high-conversion content strategies. Expertise in social analytics, brand storytelling, and content production. Strategic thinker with a hands-on edge, known for bringing big ideas to life and building loyal communities. Legally eligible to work in Canada.",
    
    areasOfExpertise: {
      column1: ["Leadership", "Strategy Development", "Project Management", "Client Account Management", "Resource allocation"],
      column2: ["Search Engine Optimization (SEO)", "Digital Media", "Content creation & production", "Social Media", "Strategy development"],
      column3: ["Performance analysis", "Metrics and Reporting", "Campaign planning", "Budgeting & Forecasting", "Brand oversight"]
    },
    
    careerAchievements: {
      campaignResults: [
        "8.8% CTR on an email marketing campaign for Ahluwalia Law Offices, well above industry average.",
        "Drove 6.6% CTR on a legal marketing LinkedIn campaign through personalized audience targeting and content alignment."
      ],
      platformSuccess: [
        "Created trend-driven Instagram and TikTok content that increased followers by 150% in 6 weeks for FreshFind.",
        "Boosted organic impressions on X by 460% through consistent content hooks for Ahluwalia Law."
      ],
      productionInnovation: [
        "Directed short-form behind-the-scenes content for YouTube, IG Reels, and TikTok for CrackerJack Television.",
        "Developed digital branding, pitch decks, and marketing collateral for over 10 small/medium business clients at Growster"
      ]
    },
    
    experiences: [
      {
        company: "VisaServe Immigration Law P.C.",
        dates: "01.2025 to present",
        title: "Content & Client Specialist (Freelance)",
        bullets: [
          "Grew reach by 228% and engagement by 4x through tailored educational reels and carousel series",
          "Created a unified social content system across TikTok, Instagram, YouTube Shorts, and X, increasing organic inbound inquiries for legal services.",
          "Designed weekly strategy decks with hooks, trends, and conversion copy for video and static content."
        ],
        keywords: ["social media", "content strategy", "engagement", "analytics", "TikTok", "Instagram", "YouTube", "digital marketing", "client management", "content specialist", "social media specialist", "marketing coordinator"]
      },
      {
        company: "Ahluwalia Law Offices",
        dates: "03.2025 to present",
        title: "Content Marketing Specialist (Freelance)",
        bullets: [
          "Led SEO-backed blog strategy and cross-platform content to reach U.S. immigrant audiences.",
          "Boosted organic impressions on X by 460% through consistent content hooks tied to real-time immigration news.",
          "Delivered weekly analytics reports and audience insights, improving CTR by 30% across content types.",
          "Established many process-related efficiencies: planning calendars, detailed forecasting tools for media buying, and support on new product strategy and selling kits"
        ],
        keywords: ["SEO", "content marketing", "analytics", "reporting", "strategy", "content calendar", "LinkedIn", "email marketing", "digital marketing", "marketing specialist", "content coordinator"]
      },
      {
        company: "CrackerJack Television LLC.",
        dates: "06.2024 to 12.2024",
        title: "Digital Strategist",
        bullets: [
          "Managed communications and developed social presence for a new television network.",
          "Created and scheduled campaigns for two flagship non-scripted shows, engaging music and culture audiences across Canada.",
          "Directed short-form behind-the-scenes content for YouTube, IG Reels, and TikTok."
        ],
        keywords: ["content production", "video", "social media", "campaign management", "YouTube", "TikTok", "Instagram", "brand management"]
      },
      {
        company: "Growster Marketing",
        dates: "06.2022 to 08.2023",
        title: "Operations Manager",
        bullets: [
          "Managed a creative and marketing team of six; served a diverse client base including e-commerce, health, and education startups",
          "Developed digital branding, pitch decks, and marketing collateral for over 10 SMB clients",
          "Directed campaign strategies, performance reviews, and client communication workflows"
        ],
        keywords: ["team management", "operations", "client management", "branding", "strategy", "B2B", "stakeholder management", "project management"]
      },
      {
        company: "FreshFind",
        dates: "01.2024 to 03.2024",
        title: "Content Production Manager",
        bullets: [
          "Designed and implemented content strategies optimized for SEO, increasing organic reach and engagement",
          "Managed content production schedules using Hootsuite and Asana to track tasks and coordinate with internal teams",
          "Fostered relationships with over 50 influencers, negotiating contracts and ensuring successful campaign deliverables"
        ],
        keywords: ["content production", "SEO", "influencer marketing", "project management", "social media", "coordination"]
      }
    ],
    
    education: [
      "Chartered Marketer (C.M.) - Canadian Marketing Association - 2025",
      "Postgraduate Certificate, Film & Multiplatform Storytelling - Humber College, Dean's List - 2024",
      "Bachelor of Arts, Media & Communication - Amity University - 2021"
    ],
    
    technicalSkills: "Canva | MS Office | Nielsen | Adobe Suite (Photoshop, Premiere Pro, After Effects, Illustrator) | Meta, X, YouTube | Google Analytics | SalesForce | MailChimp | Hootsuite | Sprout Social | Buffer | CapCut | DaVinci Resolve | WordPress | Asana | Trello"
  };

  const extractCompanyName = (jd) => {
    const lines = jd.split('\n').filter(line => line.trim());
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 2 && line.length < 60 && 
          !line.toLowerCase().includes('job') && 
          !line.toLowerCase().includes('position') &&
          !line.toLowerCase().includes('apply') &&
          !line.toLowerCase().includes('description') &&
          !/^\d/.test(line)) {
        return line;
      }
    }
    return null;
  };

  const extractJobTitle = (jd) => {
    const titleKeywords = ['manager', 'coordinator', 'specialist', 'associate', 'strategist', 'lead', 'director', 'producer'];
    const lines = jd.split('\n');
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      const lower = line.toLowerCase();
      if (titleKeywords.some(keyword => lower.includes(keyword)) && line.length < 80) {
        return line;
      }
    }
    return null;
  };

  const convertToHTML = (resumeText, coverLetterText) => {
    // Parse resume sections
    const sections = {
      name: '',
      contact: '',
      profile: '',
      expertise: [],
      achievements: { campaign: [], platform: [], production: [] },
      experiences: [],
      education: [],
      skills: ''
    };

    const lines = resumeText.split('\n');
    let currentSection = '';
    let currentSubsection = '';
    let currentExp = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;

      if (line.includes('KHATTAR') && i < 3) {
        sections.name = line;
      } else if (line.includes('@') && line.includes('|')) {
        sections.contact = line;
      } else if (line === 'PROFESSIONAL PROFILE') {
        currentSection = 'profile';
      } else if (line === 'AREAS OF EXPERTISE') {
        currentSection = 'expertise';
      } else if (line === 'CAREER ACHIEVEMENTS') {
        currentSection = 'achievements';
      } else if (line === 'PROFESSIONAL EXPERIENCE') {
        currentSection = 'experience';
      } else if (line.includes('EDUCATION')) {
        currentSection = 'education';
      } else if (line === 'TECHNICAL SKILLS') {
        currentSection = 'skills';
      } else if (currentSection === 'profile' && !line.match(/^[A-Z\s]+$/)) {
        sections.profile += line + ' ';
      } else if (currentSection === 'expertise' && !line.match(/^[A-Z\s]+$/)) {
        sections.expertise.push(line);
      } else if (currentSection === 'achievements') {
        if (line.includes('Campaign Results:')) {
          currentSubsection = 'campaign';
        } else if (line.includes('Platform Success:')) {
          currentSubsection = 'platform';
        } else if (line.includes('Production and Innovation:')) {
          currentSubsection = 'production';
        } else if (line.startsWith('•')) {
          sections.achievements[currentSubsection].push(line.substring(1).trim());
        }
      } else if (currentSection === 'experience') {
        if (line.match(/\d{2}\.\d{4}/) && !line.startsWith('•')) {
          if (currentExp) sections.experiences.push(currentExp);
          const parts = line.split(/\s{2,}/);
          currentExp = { 
            company: parts[0] || line.split(/\d{2}\.\d{4}/)[0].trim(),
            dates: line.match(/\d{2}\.\d{4}.*$/)?.[0] || '',
            title: '',
            bullets: []
          };
        } else if (currentExp && !currentExp.title && !line.startsWith('•')) {
          currentExp.title = line;
        } else if (currentExp && line.startsWith('•')) {
          currentExp.bullets.push(line.substring(1).trim());
        }
      } else if (currentSection === 'education' && !line.match(/^[A-Z\s,]+$/)) {
        sections.education.push(line);
      } else if (currentSection === 'skills') {
        sections.skills += line + ' ';
      }
    }
    
    if (currentExp) sections.experiences.push(currentExp);

    // Generate Resume HTML
    const resumeHTML = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <meta name="Originator" content="Microsoft Word 15">
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        body {
            font-family: Garamond, serif;
            font-size: 11pt;
            margin: 1in 1in 1in 1in;
            line-height: 1.15;
        }
        .name {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 6pt;
        }
        .contact {
            font-size: 11pt;
            margin-bottom: 12pt;
        }
        .heading {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 6pt;
            text-transform: uppercase;
        }
        .expertise-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12pt;
        }
        .expertise-table td {
            width: 33.33%;
            padding: 3pt 6pt;
            border-left: 1pt solid black;
            border-right: 1pt solid black;
            vertical-align: top;
            font-size: 11pt;
        }
        .expertise-table td:first-child {
            border-left: none;
        }
        .expertise-table td:last-child {
            border-right: none;
        }
        .subheading {
            font-weight: bold;
            margin-top: 6pt;
            margin-bottom: 3pt;
        }
        .job-header {
            margin-top: 9pt;
            font-weight: bold;
        }
        .job-company {
            display: inline-block;
            width: 60%;
        }
        .job-dates {
            display: inline-block;
            width: 38%;
            text-align: right;
        }
        .job-title {
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 3pt;
        }
        ul {
            margin: 3pt 0;
            padding-left: 0.3in;
        }
        li {
            margin-bottom: 3pt;
        }
        .education-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6pt;
        }
        .education-table td {
            padding: 3pt 6pt;
            border: 1pt solid black;
            font-size: 11pt;
        }
        .education-table td:nth-child(2) {
            font-weight: bold;
        }
        p {
            margin: 0 0 6pt 0;
        }
    </style>
</head>
<body>
    <div class="name">${sections.name}</div>
    <div class="contact">${sections.contact}</div>
    
    <div class="heading">Professional Profile</div>
    <p>${sections.profile.trim()}</p>
    
    <div class="heading">Areas of Expertise</div>
    <table class="expertise-table">
        ${generateExpertiseTable(sections.expertise)}
    </table>
    
    <div class="heading">Career Achievements</div>
    <div class="subheading">Campaign Results:</div>
    <ul>
        ${sections.achievements.campaign.map(a => `<li>${a}</li>`).join('')}
    </ul>
    <div class="subheading">Platform Success:</div>
    <ul>
        ${sections.achievements.platform.map(a => `<li>${a}</li>`).join('')}
    </ul>
    <div class="subheading">Production and Innovation:</div>
    <ul>
        ${sections.achievements.production.map(a => `<li>${a}</li>`).join('')}
    </ul>
    
    <div class="heading">Professional Experience</div>
    ${sections.experiences.map(exp => `
        <div class="job-header">
            <span class="job-company">${exp.company}</span>
            <span class="job-dates">${exp.dates}</span>
        </div>
        <div class="job-title">${exp.title}</div>
        <ul>
            ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
    `).join('')}
    
    <div class="heading">Education, Professional Training and Certifications</div>
    <table class="education-table">
        ${sections.education.map(edu => {
            const parts = edu.split(' - ');
            return `<tr>
                <td style="width:40%">${parts[0] || ''}</td>
                <td style="width:40%">${parts[1] || ''}</td>
                <td style="width:20%">${parts[2] || ''}</td>
            </tr>`;
        }).join('')}
    </table>
    
    <div class="heading">Technical Skills</div>
    <p>${sections.skills.trim()}</p>
</body>
</html>`;

    // Generate Cover Letter HTML
    const coverLetterHTML = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <meta name="Originator" content="Microsoft Word 15">
    <style>
        body {
            font-family: Garamond, serif;
            font-size: 11pt;
            margin: 1in 1in 1in 1in;
            line-height: 1.5;
        }
        .name {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 6pt;
        }
        .contact {
            font-size: 11pt;
            margin-bottom: 18pt;
        }
        p {
            margin: 9pt 0;
            text-align: justify;
        }
    </style>
</head>
<body>
    ${coverLetterText.split('\n\n').map(para => `<p>${para.trim()}</p>`).join('')}
</body>
</html>`;

    return { resumeHTML, coverLetterHTML };
  };

  const generateExpertiseTable = (expertiseList) => {
    // Split into 3 columns
    const col1 = [], col2 = [], col3 = [];
    expertiseList.forEach((item, idx) => {
      if (idx % 3 === 0) col1.push(item);
      else if (idx % 3 === 1) col2.push(item);
      else col3.push(item);
    });

    const maxRows = Math.max(col1.length, col2.length, col3.length);
    let rows = '';
    
    for (let i = 0; i < maxRows; i++) {
      rows += `<tr>
        <td>${col1[i] || '&nbsp;'}</td>
        <td>${col2[i] || '&nbsp;'}</td>
        <td>${col3[i] || '&nbsp;'}</td>
      </tr>`;
    }
    
    return rows;
  };

  const downloadHTML = (html, filename) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateContent = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setLoading(true);
    setError('');
    setMissingInfo([]);
    setShowInfoPrompt(false);

    try {
      const companyName = extractCompanyName(jobDescription);
      const jobTitle = extractJobTitle(jobDescription);
      
      const missing = [];
      if (!companyName) missing.push('company name');
      if (!jobTitle) missing.push('job title');
      
      if (missing.length > 0 && !additionalInfo) {
        setMissingInfo(missing);
        setShowInfoPrompt(true);
        setLoading(false);
        return;
      }

      const prompt = `You are an expert resume writer helping Mehak Khattar apply for jobs. Analyze this job description and create perfectly tailored documents.

JOB DESCRIPTION:
${jobDescription}

${additionalInfo ? `ADDITIONAL INFO PROVIDED: ${additionalInfo}` : ''}
${companyName ? `Detected Company: ${companyName}` : ''}
${jobTitle ? `Detected Job Title: ${jobTitle}` : ''}

CANDIDATE'S MASTER CONTENT:
${JSON.stringify(masterContent, null, 2)}

IMPORTANT INSTRUCTIONS FOR FREELANCE ROLES:
For VisaServe Immigration Law P.C. and Ahluwalia Law Offices positions, you MUST adjust the job titles to match the role being applied for. These are freelance positions where Mehak performed multiple functions.

Examples:
- If applying for "Social Media Manager" → change title to "Social Media Manager (Freelance)"
- If applying for "Content Marketing Specialist" → change title to "Content Marketing Specialist (Freelance)"
- If applying for "Digital Marketing Coordinator" → change title to "Digital Marketing Coordinator (Freelance)"
- If applying for "Brand Manager" → change title to "Brand Manager (Freelance)"
- If applying for "Marketing Coordinator" → change title to "Marketing Coordinator (Freelance)"

The job responsibilities (bullets) remain the same - just adjust the title to match the target role. Always keep "(Freelance)" in parentheses.

YOUR TASK:

1. ANALYZE the job description for:
   - Exact job title being applied for
   - Seniority level (entry/coordinator vs mid-level specialist vs senior manager)
   - Top 10 keywords and required skills
   - Main responsibilities

2. CREATE A TAILORED RESUME:

MEHAK KHATTAR, C.M.
khattarmehak1@gmail.com | 416.893.1395 | Mehak Khattar | LinkedIn

PROFESSIONAL PROFILE
[Write 3-4 sentences emphasizing relevant experience for THIS role]

AREAS OF EXPERTISE
[List 15 items total, one per line - these will be arranged in 3 columns. Prioritize skills from JD]
Leadership
Strategy Development
Project Management
[... continue for 15 total items]

CAREER ACHIEVEMENTS
Campaign Results:
- [Achievement 1]
- [Achievement 2]

Platform Success:
- [Achievement 1]
- [Achievement 2]

Production and Innovation:
- [Achievement 1]
- [Achievement 2]

PROFESSIONAL EXPERIENCE
[Select 2-4 most relevant experiences]

[Company Name]  [Dates]
[Job Title - ADJUSTED FOR FREELANCE ROLES]
- [Bullet 1]
- [Bullet 2]
- [Bullet 3]

EDUCATION, PROFESSIONAL TRAINING AND CERTIFICATIONS
Chartered Marketer (C.M.) - Canadian Marketing Association - 2025
Postgraduate Certificate, Film & Multiplatform Storytelling - Humber College, Dean's List - 2024
Bachelor of Arts, Media & Communication - Amity University - 2021

TECHNICAL SKILLS
[All tools, emphasizing those in JD]

3. CREATE A COVER LETTER:

MEHAK KHATTAR, C.M.
khattarmehak1@gmail.com | 416.893.1395 | Mehak Khattar | LinkedIn

${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

${companyName || '[Company Name]'}

Re: Application for ${jobTitle || '[Job Title]'}

Dear Hiring Team,

[4-5 paragraphs as structured before]

Sincerely,
Mehak Khattar, Chartered Marketer (C.M.)

Return ONLY valid JSON:
{
  "resume": "complete resume text",
  "coverLetter": "complete cover letter text"
}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      const content = data.content[0].text;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setResumeText(result.resume);
        setCoverLetterText(result.coverLetter);
      } else {
        throw new Error('Could not parse AI response');
      }

    } catch (err) {
      setError(`Error: ${err.message}. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const handleDownloadHTML = () => {
    const { resumeHTML, coverLetterHTML } = convertToHTML(resumeText, coverLetterText);
    downloadHTML(resumeHTML, 'Mehak_Khattar_Resume.html');
    downloadHTML(coverLetterHTML, 'Mehak_Khattar_Cover_Letter.html');
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4" },
    React.createElement('div', { className: "max-w-7xl mx-auto" },
      React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-8 mb-6" },
        React.createElement('div', { className: "flex items-center gap-3 mb-4" },
          React.createElement('div', { className: "text-indigo-600 text-3xl" }, '💼'),
          React.createElement('h1', { className: "text-3xl font-bold text-gray-800" }, 'AI Resume & Cover Letter Generator')
        ),
        
        React.createElement('p', { className: "text-gray-600 mb-6" },
          'Paste job description → Get tailored resume + cover letter as HTML → Open in Word → Save as DOCX. Perfect Garamond formatting!'
        ),

        React.createElement('div', { className: "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6" },
          React.createElement('p', { className: "text-sm text-gray-800" },
            React.createElement('strong', null, 'Pro Tip: '),
            'Speed matters! ATS systems sort by application order. Apply fast with pre-optimized resumes.'
          )
        ),

        React.createElement('div', { className: "space-y-4" },
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" },
              'Job Description'
            ),
            React.createElement('textarea', {
              value: jobDescription,
              onChange: (e) => setJobDescription(e.target.value),
              className: "w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500",
              placeholder: "Paste the job description here..."
            })
          ),

          showInfoPrompt && React.createElement('div', { className: "bg-blue-50 border-l-4 border-blue-400 p-4" },
            React.createElement('p', { className: "text-sm text-gray-800 mb-2" },
              React.createElement('strong', null, 'Missing: '),
              missingInfo.join(' and ')
            ),
            React.createElement('input', {
              type: "text",
              value: additionalInfo,
              onChange: (e) => setAdditionalInfo(e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded",
              placeholder: `Enter ${missingInfo.join(' and ')}...`
            })
          ),

          error && React.createElement('div', { className: "bg-red-50 border-l-4 border-red-400 p-4" },
            React.createElement('p', { className: "text-sm text-red-800" }, error)
          ),

          React.createElement('button', {
            onClick: generateContent,
            disabled: loading,
            className: "w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium text-lg"
          },
            loading ? '⏳ Generating...' : '📄 Generate Documents'
          )
        )
      ),

      (resumeText || coverLetterText) && React.createElement('div', null,
        React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-6 mb-6" },
          React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-4" }, 'Generated Documents'),
          
          React.createElement('div', { className: "flex gap-4 mb-6" },
            React.createElement('button', {
              onClick: handleDownloadHTML,
              className: "flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium"
            }, '⬇️ Download Both as HTML'),
            React.createElement('button', {
              onClick: () => handleCopy(resumeText, 'resume'),
              className: "px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            }, copied.resume ? '✓ Copied Resume!' : '📋 Copy Resume'),
            React.createElement('button', {
              onClick: () => handleCopy(coverLetterText, 'cover'),
              className: "px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            }, copied.cover ? '✓ Copied Letter!' : '📋 Copy Letter')
          ),

          React.createElement('div', { className: "bg-blue-50 border-l-4 border-blue-500 p-4 mb-4" },
            React.createElement('p', { className: "font-bold text-blue-900 mb-2" }, '📝 How to use HTML files:'),
            React.createElement('ol', { className: "list-decimal ml-5 text-blue-800 space-y-1" },
              React.createElement('li', null, 'Click "Download Both as HTML"'),
              React.createElement('li', null, 'Right-click each file → Open with Microsoft Word'),
              React.createElement('li', null, 'In Word: File → Save As → Choose ".docx"'),
              React.createElement('li', null, 'Perfect Garamond formatting preserved!
                                     React.createElement('div', { className: "grid md:grid-cols-2 gap-4" },
        React.createElement('div', null,
          React.createElement('h3', { className: "font-bold text-gray-800 mb-2" }, 'Resume Preview:'),
          React.createElement('div', { className: "bg-gray-50 rounded p-4 max-h-96 overflow-y-auto" },
            React.createElement('pre', { className: "whitespace-pre-wrap text-xs font-mono" }, resumeText)
          )
        ),
        React.createElement('div', null,
          React.createElement('h3', { className: "font-bold text-gray-800 mb-2" }, 'Cover Letter Preview:'),
          React.createElement('div', { className: "bg-gray-50 rounded p-4 max-h-96 overflow-y-auto" },
            React.createElement('pre', { className: "whitespace-pre-wrap text-xs font-mono" }, coverLetterText)
          )
        )
      )
    )
  )
)
