const { useState } = React;
const { Loader2, Download, Copy, CheckCircle2, FileText, Briefcase } = lucide;

function ResumeGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState({ resume: false, cover: false });
  const [error, setError] = useState('');
  const [missingInfo, setMissingInfo] = useState([]);
  const [showInfoPrompt, setShowInfoPrompt] = useState(false);

  const masterContent = {
    name: "MEHAK KHATTAR, C.M.(in progress)",
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
        title: "Content & Client Manager",
        bullets: [
          "Grew reach by 228% and engagement by 4x through tailored educational reels and carousel series",
          "Created a unified social content system across TikTok, Instagram, YouTube Shorts, and X, increasing organic inbound inquiries for legal services.",
          "Designed weekly strategy decks with hooks, trends, and conversion copy for video and static content."
        ],
        keywords: ["social media", "content strategy", "engagement", "analytics", "TikTok", "Instagram", "YouTube", "digital marketing", "client management"]
      },
      {
        company: "Ahluwalia Law Offices",
        dates: "03.2025 to present",
        title: "Content Marketing Consultant",
        bullets: [
          "Led SEO-backed blog strategy and cross-platform content to reach U.S. immigrant audiences.",
          "Boosted organic impressions on X by 460% through consistent content hooks tied to real-time immigration news.",
          "Delivered weekly analytics reports and audience insights, improving CTR by 30% across content types.",
          "Established many process-related efficiencies: planning calendars, detailed forecasting tools for media buying, and support on new product strategy and selling kits"
        ],
        keywords: ["SEO", "content marketing", "analytics", "reporting", "strategy", "content calendar", "LinkedIn", "email marketing", "digital marketing"]
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
      "Chartered Marketer Designation - Canadian Marketing Association - In progress",
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

YOUR TASK:

1. ANALYZE the job description for:
   - Seniority level (entry/coordinator vs mid-level specialist vs senior manager)
   - Top 10 keywords and required skills
   - Main responsibilities
   - Industry/company culture clues

2. CREATE A TAILORED RESUME that:
   - Matches this EXACT format structure (preserve spacing and layout):

MEHAK KHATTAR, C.M.(in progress)
khattarmehak1@gmail.com | 416.893.1395 | Mehak Khattar | LinkedIn

PROFESSIONAL PROFILE
[Write 3-4 sentences emphasizing the experience most relevant to THIS role. Adjust tone based on seniority - more execution-focused for coordinator roles, more strategic for manager roles. Include specific platforms/skills mentioned in JD.]

AREAS OF EXPERTISE
[Format as 3 columns with 5 items each, separated by spaces. Prioritize skills from JD.]
Column 1:                          Column 2:                          Column 3:
Leadership                         SEO                                Performance analysis
Strategy Development               Digital Media                      Metrics & Reporting
[etc - 5 items per column]

CAREER ACHIEVEMENTS
Campaign Results:
- [Select 2 most relevant achievements from the master content]

Platform Success:
- [Select 2 most relevant achievements]

Production and Innovation:
- [Select 2 most relevant achievements]

PROFESSIONAL EXPERIENCE
[Select 2-4 experiences from master content based on relevance to JD. Prioritize recent roles unless older ones are more relevant.]

[Company Name]  [Dates]
[Job Title]
- [Reorder bullets to put most JD-relevant first]
- [Include quantifiable results when possible]
- [Use keywords from JD naturally]

[Repeat for 2-4 most relevant positions]

EDUCATION, PROFESSIONAL TRAINING AND CERTIFICATIONS
Chartered Marketer Designation - Canadian Marketing Association - In progress
Postgraduate Certificate, Film & Multiplatform Storytelling - Humber College, Dean's List - 2024
Bachelor of Arts, Media & Communication - Amity University - 2021

TECHNICAL SKILLS
[List all skills from master content, but emphasize tools mentioned in JD]

3. CREATE A COVER LETTER that:
   - Uses this structure:

MEHAK KHATTAR, C.M.(in progress)
khattarmehak1@gmail.com | 416.893.1395 | Mehak Khattar | LinkedIn

[Today's Date]

[Company Name]
[If available, hiring manager name]

Re: Application for [Job Title]

Dear [Hiring Manager/Hiring Team],

[Opening paragraph: Express genuine enthusiasm for THIS specific role at THIS company. Reference something specific about the company/role that excites you.]

[Body paragraph 1: Highlight your most relevant achievement that matches the top requirement in the JD. Use specific metrics.]

[Body paragraph 2: Highlight your second most relevant strength/achievement. Connect it directly to a responsibility mentioned in the JD.]

[Body paragraph 3: Show you understand the company's needs and explain how your unique blend of skills (mention 2-3 specific ones from JD) makes you ideal.]

[Closing: Express enthusiasm, indicate availability, and include clear call to action.]

Thank you for considering my application. I look forward to discussing how I can contribute to [Company Name]'s success.

Sincerely,
Mehak Khattar, Chartered Marketer (C.M.)

IMPORTANT FORMATTING RULES:
- Preserve exact spacing and line breaks as shown
- Use bullet points (•) for lists
- Keep the 3-column format for Areas of Expertise
- Maintain professional but warm tone
- For coordinator/associate roles: emphasize execution, support, and growth
- For specialist roles: balance execution with strategy
- For manager roles: emphasize leadership, strategy, and results

Return ONLY valid JSON in this format (no markdown, no extra text):
{
  "resume": "complete resume text with exact formatting",
  "coverLetter": "complete cover letter text with exact formatting"
}`;

      const apiKey = 'YOUR_API_KEY_HERE'; // We'll replace this with environment variable
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setResume(result.resume);
        setCoverLetter(result.coverLetter);
      } else {
        throw new Error('Could not parse AI response');
      }

    } catch (err) {
      setError(`Error: ${err.message}. Please check your API key and try again.`);
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

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4" },
    React.createElement('div', { className: "max-w-7xl mx-auto" },
      React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-8 mb-6" },
        React.createElement('div', { className: "flex items-center gap-3 mb-4" },
          React.createElement('div', { className: "text-indigo-600 text-3xl" }, '💼'),
          React.createElement('h1', { className: "text-3xl font-bold text-gray-800" }, 'AI Resume & Cover Letter Generator')
        ),
        
        React.createElement('p', { className: "text-gray-600 mb-6" },
          'Paste any job description and get a perfectly tailored resume + cover letter in seconds. Optimized for speed - applying to jobs has never been faster!'
        ),

        React.createElement('div', { className: "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6" },
          React.createElement('p', { className: "text-sm text-gray-800" },
            React.createElement('strong', null, 'Pro Tip from Corporate Recruiters: '),
            'Speed matters! Most ATS systems sort by application order, not keywords. Apply fast with pre-optimized resumes. This tool helps you maintain quality while maximizing speed.'
          )
        ),

        React.createElement('div', { className: "space-y-4" },
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" },
              'Job Description (paste the entire JD)'
            ),
            React.createElement('textarea', {
              value: jobDescription,
              onChange: (e) => setJobDescription(e.target.value),
              className: "w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              placeholder: "Paste the job description here..."
            })
          ),

          showInfoPrompt && React.createElement('div', { className: "bg-blue-50 border-l-4 border-blue-400 p-4" },
            React.createElement('p', { className: "text-sm text-gray-800 mb-2" },
              React.createElement('strong', null, 'Missing Information: '),
              `I couldn't detect the ${missingInfo.join(' and ')} from the job description.`
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
            className: "w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg"
          },
            loading ? '⏳ Generating your tailored documents...' : '📄 Generate Resume & Cover Letter'
          )
        )
      ),

      (resume || coverLetter) && React.createElement('div', { className: "grid md:grid-cols-2 gap-6" },
        resume && React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-6" },
          React.createElement('div', { className: "flex items-center justify-between mb-4" },
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800" }, 'Resume'),
            React.createElement('div', { className: "flex gap-2" },
              React.createElement('button', {
                onClick: () => handleCopy(resume, 'resume'),
                className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              }, copied.resume ? '✓ Copied!' : '📋 Copy'),
              React.createElement('button', {
                onClick: () => handleDownload(resume, 'Mehak_Khattar_Resume.txt'),
                className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              }, '⬇️ Download')
            )
          ),
          React.createElement('div', { className: "bg-gray-50 rounded p-4 max-h-[600px] overflow-y-auto" },
            React.createElement('pre', { className: "whitespace-pre-wrap text-sm font-mono" }, resume)
          )
        ),

        coverLetter && React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-6" },
          React.createElement('div', { className: "flex items-center justify-between mb-4" },
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800" }, 'Cover Letter'),
            React.createElement('div', { className: "flex gap-2" },
              React.createElement('button', {
                onClick: () => handleCopy(coverLetter, 'cover'),
                className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              }, copied.cover ? '✓ Copied!' : '📋 Copy'),
              React.createElement('button', {
                onClick: () => handleDownload(coverLetter, 'Mehak_Khattar_Cover_Letter.txt'),
                className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              }, '⬇️ Download')
            )
          ),
          React.createElement('div', { className: "bg-gray-50 rounded p-4 max-h-[600px] overflow-y-auto" },
            React.createElement('pre', { className: "whitespace-pre-wrap text-sm font-mono" }, coverLetter)
          )
        )
      ),

      React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-6 mt-6" },
        React.createElement('h3', { className: "text-lg font-bold text-gray-800 mb-3" }, 'How This Tool Works:'),
        React.createElement('ul', { className: "space-y-2 text-sm text-gray-700" },
          React.createElement('li', null, '✅ Analyzes job description for keywords, seniority level, and requirements'),
          React.createElement('li', null, '✅ Selects your most relevant 2-3 work experiences based on JD match'),
          React.createElement('li', null, '✅ Reorders bullet points to highlight what matters most for THIS role'),
          React.createElement('li', null, '✅ Tailors your professional profile to the specific opportunity'),
          React.createElement('li', null, '✅ Generates a personalized cover letter addressing the company and role'),
          React.createElement('li', null, '✅ Maintains your exact formatting and structure'),
          React.createElement('li', null, '✅ Ready to apply in under 60 seconds!')
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(ResumeGenerator), document.getElementById('root'));
