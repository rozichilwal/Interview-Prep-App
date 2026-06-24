const { GoogleGenAI } = require("@google/genai")
const { z} = require("zod")
const { zodToJsonSchema } =require("zod-to-json-schema")
const puppeteer = require("puppeteer")







const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


function generatePartialReportFallback(resume, jobDescription) {
    // Basic text matching logic
    const resumeLower = resume.toLowerCase();
    const jobDescLower = jobDescription.toLowerCase();
    
    // Extracted some dummy skills to check
    const commonSkills = ["react", "node", "javascript", "python", "java", "c++", "docker", "kubernetes", "aws", "azure", "gcp", "sql", "mongodb", "express", "typescript", "html", "css", "machine learning", "data science", "api", "git", "ci/cd"];
    
    let matchCount = 0;
    let totalSkillsFoundInJob = 0;
    const skillGaps = [];

    commonSkills.forEach(skill => {
        if (jobDescLower.includes(skill)) {
            totalSkillsFoundInJob++;
            if (resumeLower.includes(skill)) {
                matchCount++;
            } else {
                skillGaps.push({
                    skill: skill,
                    severity: "medium"
                });
            }
        }
    });

    const matchScore = totalSkillsFoundInJob === 0 ? 50 : Math.round((matchCount / totalSkillsFoundInJob) * 100);

    return {
        title: "Partial Report (AI Unavailable)",
        matchScore,
        technicalQuestions: [],
        behavioralQuestions: [],
        skillGaps: skillGaps.slice(0, 5), // return max 5 gaps
        preparationPlan: [],
        isPartial: true,
        message: "Interview questions are not available temporarily due to high AI model traffic."
    };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

const prompt = `
Return ONLY valid JSON.

Example format:

{
  "title":"Full Stack Developer",
  "matchScore":85,

  "technicalQuestions":[
    {
      "question":"What is React?",
      "intention":"Check React knowledge",
      "answer":"Explain components, virtual DOM and hooks."
    }
  ],

  "behavioralQuestions":[
    {
      "question":"Tell me about a challenge.",
      "intention":"Check problem solving",
      "answer":"Use STAR method."
    }
  ],

  "skillGaps":[
    {
      "skill":"Docker",
      "severity":"medium"
    }
  ],

  "preparationPlan":[
    {
      "day":1,
      "focus":"React",
      "tasks":["Study hooks","Build mini project"]
    }
  ]
}

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const modelsToTry = [
        { provider: 'google', model: 'gemini-2.5-flash' },
        { provider: 'google', model: 'gemini-2.0-flash' },
        { provider: 'groq', model: 'llama-3.3-70b-versatile' }
    ];

    for (const modelInfo of modelsToTry) {
        try {
            if (modelInfo.provider === 'google') {
                const response = await ai.models.generateContent({
                    model: modelInfo.model,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                    }
                });
                return JSON.parse(response.text);
            } else if (modelInfo.provider === 'groq') {
                if (!process.env.GROQ_API_KEY) {
                    console.warn("GROQ_API_KEY not found, skipping Groq model.");
                    continue;
                }
                const Groq = require('groq-sdk');
                const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        }
                    ],
                    model: modelInfo.model,
                    response_format: { type: "json_object" }
                });
                return JSON.parse(chatCompletion.choices[0].message.content);
            }
        } catch (error) {
            console.error(`Error with model ${modelInfo.model}:`, error.message);
            // continue to next model
        }
    }

    console.log("All models failed, returning partial data.");
    return generatePartialReportFallback(resume, jobDescription);
}


async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, {waitUntil: "networkidle0"})

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })


    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}





module.exports = {generateInterviewReport, generateResumePdf}