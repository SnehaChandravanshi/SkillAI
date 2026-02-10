const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.chatWithMentor = async (req, res) => {
  try {
    const { message, roadmap, progress, history } = req.body;

    // Construct conversation history for context
    // Limit to last 10 messages to save tokens and keep context relevant
    const recentHistory = history ? history.slice(-10).map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    })) : [];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a friendly, expert AI mentor for a skill-based learning platform.
Your goal is to help the learner with their specific questions, code issues, or career advice.

CONTEXT:
- Active Roadmap: ${roadmap ? `${roadmap.skill} (${roadmap.level})` : "None selected"}
- Current Progress: ${progress ? `${progress.completedModules.length} modules completed` : "Just started"}

INSTRUCTIONS:
1. PRIORITIZE the learner's specific question above all else.
2. Use the roadmap ONLY as background context if relevant. Do NOT force every answer to be about the roadmap topic if the user asks something else.
3. If the user asks about a specific coding concept, explain it clearly with short examples.
4. Keep answers concise, motivating, and practical.
5. maintain a conversational flow using the chat history.
          `,
        },
        ...recentHistory, // Insert history here
        {
          role: "user",
          content: message, // The actual new question
        },
      ],
      temperature: 0.6, // Slightly higher creativity for better conversation
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("MENTOR ERROR:", err.message);
    res.status(500).json({ msg: "Mentor failed" });
  }
};
