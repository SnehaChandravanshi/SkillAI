const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ===============================
   SAFE JSON EXTRACTOR
================================ */
function extractJSON(text) {
  try {
    // 1. Remove markdown code fences
    let cleaned = text
      .replace(/```json/gi, "")
      .replace(/```javascript/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Find JSON object or array boundaries safely
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");

    let start = -1;
    let end = -1;

    // Determine if it's an object or an array based on which comes first
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace;
      end = cleaned.lastIndexOf("}");
    } else if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = cleaned.lastIndexOf("]");
    }

    if (start === -1 || end === -1) {
      throw new Error("No JSON object or array found in AI output");
    }

    const jsonString = cleaned.substring(start, end + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ AI RAW OUTPUT:\n", text);
    throw err;
  }
}


/* ===============================
   CORE AI CALL
================================ */
async function runPrompt(prompt) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a strict JSON generator." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}

/* ===============================
   ROADMAP GENERATION
================================ */

async function generateRoadmap({ skill, subSkills, level, timeline }) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are an expert learning architect. Always respond with VALID JSON ONLY.",
      },
      {
        role: "user",
        content: `
Create a ${timeline}-week learning roadmap for:
Skill: ${skill}
Level: ${level}
${subSkills.length > 0 ? `Sub-skills to cover: ${subSkills.join(", ")}` : "Comprehensive coverage of the topic."}

Return ONLY a JSON object in this format:
{
  "isCoding": boolean, // true if the skill involves writing code (e.g. Python, React), false otherwise (e.g. History, Leadership)
  "roadmap": [
    {
      "week": 1,
      "focus": "Topic name",
      "modules": ["Module 1", "Module 2"]
    }
  ]
}
        `,
      },
    ],
    temperature: 0.3,
  });

  // ✅ FIX IS HERE
  const text = completion.choices[0].message.content;

  // Safety: extract JSON only
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}") + 1;

  const json = JSON.parse(text.slice(start, end));
  return json;
}

module.exports = {
  generateRoadmap,
};

/* ===============================
   MODULE GENERATION
================================ */
async function generateModule({ topic, level }) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a senior programming instructor. Respond ONLY in valid JSON. Do not use backticks or markdown formatting within the JSON strings.",
      },
      {
        role: "user",
        content: `
Generate a learning module for:
Topic: ${topic}
Level: ${level}

Level: ${level}

STRICT RULES:
- Return valid JSON only.
- Do NOT use backticks (\`) for strings. Use double quotes (").
- Escape all special characters in code strings properly.

JSON format:
{
  "explanation": {
    "definition": "A clear definition",
    "keyCharacteristics": ["characteristic 1", "characteristic 2"],
    "useCases": ["use case 1", "use case 2"]
  },
  "codeExamples": [
    {
      "title": "Example Title",
      "code": "code snippet"
    }
  ],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "practiceTasks": [
    {
      "title": "Task Title",
      "description": "Task description",
      "code": "starter code"
    }
  ]
}
        `,
      },
    ],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content;
  return extractJSON(text);
}

module.exports = {
  generateRoadmap,
  generateModule,
};

/* ===============================
   LESSON GENERATION
================================ */
exports.generateLesson = async ({ topic, level }) => {
  const prompt = `
Create a lesson on "${topic}" for a ${level} learner.

STRICT RULES:
- Output ONLY valid JSON
- Do NOT use markdown
- Do NOT use backticks
- Code must be an ARRAY of strings (each line one string)

JSON FORMAT:
{
  "explanation": "string",
  "codeExamples": [
    "line 1 of code",
    "line 2 of code"
  ],
  "commonMistakes": "string",
  "practiceQuestions": ["string"]
}
`;

  const response = await runPrompt(prompt);
  return extractJSON(response);
};




/* ===============================
   ASSESSMENT GENERATION
================================ */
exports.generateAssessment = async ({ topic, level }) => {
  const prompt = `
Create an assessment for "${topic}" (${level}).

Rules:
- Output ONLY JSON

Format:
{
  "mcqs": [],
  "codingQuestions": [],
  "scenarioQuestions": []
}
`;

  const response = await runPrompt(prompt);
  return extractJSON(response);
};

async function generateQuiz(topic, level) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are an expert instructor. Respond ONLY with valid JSON.",
      },
      {
        role: "user",
        content: `
Create 5 MCQ questions for:
Topic: ${topic}
Level: ${level}

JSON format:
[
  {
    "question": "question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0
  }
]
        `,
      },
    ],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content;
  return extractJSON(text);
}

module.exports = {
  generateRoadmap,
  generateModule,
  generateQuiz,
};

async function generateCodingChallenge(topic, level) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a senior software engineer. Respond ONLY in valid JSON.",
      },
      {
        role: "user",
        content: `
Create a coding challenge for:
Topic: ${topic}
Level: ${level}

JSON format:
{
  "prompt": "problem statement",
  "solutionHint": "brief hint"
}
        `,
      },
    ],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content;
  return extractJSON(text);
}

async function reviewCode(prompt, userCode) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a strict but helpful code reviewer. Respond in plain text.",
      },
      {
        role: "user",
        content: `
Problem:
${prompt}

User code:
${userCode}

Give:
1. Correctness
2. Improvements
3. Best practices
4. Common mistakes
        `,
      },
    ],
    temperature: 0.4,
  });

  return completion.choices[0].message.content;
}

module.exports = {
  generateRoadmap,
  generateModule,
  generateQuiz,
  generateCodingChallenge,
  reviewCode,
};


/* ===============================
   AI MENTOR CHAT
================================ */
exports.aiMentorChat = async ({ context, userMessage }) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a helpful AI mentor." },
      {
        role: "user",
        content: `Context:\n${context}\n\nUser Question:\n${userMessage}`
      }
    ],
    temperature: 0.6,
  });

  return completion.choices[0].message.content;
};
