import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import {
  getCurriculumFlashcards,
  getCurriculumQuiz,
  getCurriculumStudyAnswer,
} from "./curriculumFallback";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with safety limits
app.use(express.json({ limit: "2mb" }));

// Model Candidate List in order of preference (Fast, high quota, verified reliable)
// Avoid gemini-3.6-flash due to tight 20 req/day quota
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientError(err: any): boolean {
  const msg = err?.message || String(err || "");
  const code = err?.status || err?.code || err?.statusCode;
  return (
    code === 503 ||
    code === 429 ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg.includes("quota") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("rate-limits")
  );
}

function parseRetryDelay(err: any): number {
  const msg = err?.message || "";
  const match = msg.match(/retry in ([0-9.]+)s/i);
  if (match && match[1]) {
    const s = parseFloat(match[1]);
    if (!isNaN(s) && s > 0 && s <= 4) {
      return Math.ceil(s * 1000) + 250;
    }
  }
  return 1200;
}

// System instruction for EduMind AI
const EDUMIND_SYSTEM_INSTRUCTION = `You are EduMind AI, an intelligent, world-class, patient, and beginner-friendly AI Study Companion built for college and university students.
Tagline: "Learn Smarter. Code Better. Prepare Better."

Your core objectives:
1. Help students deeply understand concepts rather than just memorizing answers.
2. Provide clear, step-by-step breakdowns for STEM, Computer Science, Engineering, Mathematics, and Humanities.
3. When answering programming & coding questions:
   - Clarify the algorithm/logic before writing code.
   - Provide clean, modern, idiomatic code with helpful comments.
   - Mention Time & Space complexity (Big-O).
   - Highlight common pitfalls and edge cases.
4. When helping with exams, summaries & study plans:
   - Use clear formatting with Markdown headings (##, ###), bullet points, bold key terms, and markdown tables where suitable.
   - Provide high-yield review takeaways and active-recall test checkpoints.
5. Tone and style:
   - Academic yet warm, encouraging, and easy to follow.
   - Always prioritize clarity and brevity over long fluff. Respect the student's study time.`;

// Mode-specific prompt supplements
const MODE_INSTRUCTIONS: Record<string, string> = {
  general: "Provide well-rounded, intuitive explanations balancing concepts, practical examples, and high-yield insights.",
  concept: "Focus especially on building intuition, visual mental models, real-world analogies, and foundational definitions.",
  code: "Focus on code quality, line-by-line breakdown, time/space complexity (Big-O), and common debugging pitfalls.",
  exam: "Focus on high-yield exam preparation, core formulas, active recall questions, and common exam trick questions.",
  summary: "Format as clean, concise study notes with bullet points, key definitions, and a structured summary table.",
  planner: "Structure as an actionable, realistic study schedule with daily goals, milestone checkpoints, and review intervals.",
  interview: "Conduct this like a technical/academic interview coach. Provide evaluation rubrics and tips for articulate answers.",
};

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured on the server. Please check AI Studio Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Local file persistence for conversation history on server
const CONVERSATIONS_FILE = path.join(process.cwd(), "conversations_store.json");

const SEED_SERVER_CONVERSATIONS = [
  {
    id: "conv-dsa-trees",
    title: "DSA: Binary Search Tree & AVL Balancing",
    createdAt: Date.now() - 3600 * 1000 * 3,
    updatedAt: Date.now() - 3600 * 1000 * 2,
    studyMode: "concept",
    messages: [
      {
        id: "msg-seed-1",
        role: "user",
        content: "Explain Binary Search Tree (BST) operations and how AVL Trees prevent O(N) worst-case skewness.",
        timestamp: Date.now() - 3600 * 1000 * 3,
        studyMode: "concept",
      },
      {
        id: "msg-seed-2",
        role: "assistant",
        content: "### 🌲 Binary Search Tree (BST) vs AVL Tree\n\nIn a standard **Binary Search Tree (BST)**:\n- For any node $N$, values in the left subtree are $< N$ and right subtree are $> N$.\n- **Average Time Complexity**: $O(\\log N)$ for search, insertion, and deletion.\n- **Worst Case**: If elements are inserted in sorted order, the tree degenerates into a linked list with $O(N)$ height.\n\n### ⚖️ AVL Trees (Adelson-Velsky and Landis)\nAn AVL tree is a **Self-Balancing Binary Search Tree** that guarantees $O(\\log N)$ time complexity even in the worst case.\n\n- **Balance Factor ($BF$)**:\n  $$\\text{BF} = \\text{Height(Left Subtree)} - \\text{Height(Right Subtree)}$$\n  For every node, $BF \\in \\{-1, 0, +1\\}$.\n- When an insertion causes $|BF| > 1$, self-balancing rotations are performed:\n  1. **LL Rotation (Right Rotation)**: Inserted in left child of left subtree\n  2. **RR Rotation (Left Rotation)**: Inserted in right child of right subtree\n  3. **LR Rotation**: Left-Right double rotation\n  4. **RL Rotation**: Right-Left double rotation.",
        timestamp: Date.now() - 3600 * 1000 * 2.5,
        studyMode: "concept",
      },
    ],
  },
  {
    id: "conv-os-deadlock",
    title: "Operating Systems: Deadlock & Banker's Algorithm",
    createdAt: Date.now() - 3600 * 1000 * 24,
    updatedAt: Date.now() - 3600 * 1000 * 22,
    studyMode: "exam",
    messages: [
      {
        id: "msg-seed-3",
        role: "user",
        content: "What are Coffman's 4 conditions for deadlock, and how does Banker's Algorithm ensure a safe state?",
        timestamp: Date.now() - 3600 * 1000 * 24,
        studyMode: "exam",
      },
      {
        id: "msg-seed-4",
        role: "assistant",
        content: "### 🔒 Coffman's 4 Necessary Conditions for Deadlock\n\nA deadlock can occur if and only if **all 4 conditions** hold simultaneously:\n\n1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.\n2. **Hold and Wait**: A process is holding at least one resource and waiting to acquire additional resources held by other processes.\n3. **No Preemption**: Resources cannot be preempted; they can only be released voluntarily by the process holding them.\n4. **Circular Wait**: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.\n\n### 🏦 Banker's Algorithm for Deadlock Avoidance\n- Evaluates resource allocation requests dynamically by checking if granting the request leads to a **Safe State**.\n- If a safe sequence $\\langle P_1, P_2, \\dots, P_n \\rangle$ exists where all processes can finish executing, the allocation is granted; otherwise, the request is delayed.",
        timestamp: Date.now() - 3600 * 1000 * 23,
        studyMode: "exam",
      },
    ],
  },
];

function loadServerConversations(): any[] {
  try {
    if (fs.existsSync(CONVERSATIONS_FILE)) {
      const data = fs.readFileSync(CONVERSATIONS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed initial demo conversations
    saveServerConversations(SEED_SERVER_CONVERSATIONS);
    return SEED_SERVER_CONVERSATIONS;
  } catch (err) {
    console.error("Failed to read conversations_store.json", err);
    return SEED_SERVER_CONVERSATIONS;
  }
}

function saveServerConversations(conversations: any[]): void {
  try {
    fs.writeFileSync(
      CONVERSATIONS_FILE,
      JSON.stringify(conversations, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Failed to write conversations_store.json", err);
  }
}

// Ensure Gemini conversation history strictly alternates and starts with user
function formatContentsForGemini(
  history: Array<{ role: string; content: string }>,
  currentMessage: string
): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> {
  const cleanTurns: Array<{ role: "user" | "model"; text: string }> = [];

  for (const item of history) {
    if (!item || typeof item.content !== "string" || !item.content.trim()) continue;
    const role: "user" | "model" =
      item.role === "assistant" || item.role === "model" ? "model" : "user";
    const text = item.content.slice(0, 2500).trim();
    if (!text) continue;

    // Gemini requires the conversation to start with 'user'
    if (cleanTurns.length === 0 && role === "model") {
      continue;
    }

    // Merge consecutive turns with the same role to prevent Gemini 400 errors
    if (cleanTurns.length > 0 && cleanTurns[cleanTurns.length - 1].role === role) {
      cleanTurns[cleanTurns.length - 1].text += `\n\n${text}`;
    } else {
      cleanTurns.push({ role, text });
    }
  }

  // The last turn before our current user message MUST be 'model'
  // If the last turn was 'user', drop it so current user message doesn't cause collision
  if (cleanTurns.length > 0 && cleanTurns[cleanTurns.length - 1].role === "user") {
    cleanTurns.pop();
  }

  // Take most recent 10 turns (up to 5 back-and-forth pairs)
  const recentTurns = cleanTurns.slice(-10);

  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = recentTurns.map(
    (t) => ({
      role: t.role,
      parts: [{ text: t.text }],
    })
  );

  // Add the current user query as the final turn
  contents.push({
    role: "user",
    parts: [{ text: currentMessage.trim() }],
  });

  return contents;
}

// Health and information endpoint
app.get("/api/info", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  res.json({
    status: "ok",
    app: "EduMind AI",
    model: CANDIDATE_MODELS[0],
    fallbackModels: CANDIDATE_MODELS,
    isApiKeyConfigured: hasKey,
    quotaFriendly: true,
  });
});

// Conversations persistence endpoints (ensures history is NEVER lost even if browser storage resets)
app.get("/api/conversations", (req, res) => {
  const conversations = loadServerConversations();
  res.json({ success: true, conversations });
});

app.post("/api/conversations", (req, res) => {
  const { conversations } = req.body;
  if (!Array.isArray(conversations)) {
    res.status(400).json({ error: "conversations must be an array." });
    return;
  }
  saveServerConversations(conversations);
  res.json({ success: true, count: conversations.length });
});

app.delete("/api/conversations/:id", (req, res) => {
  const id = req.params.id;
  const list = loadServerConversations();
  const filtered = list.filter((c) => c.id !== id);
  saveServerConversations(filtered);
  res.json({ success: true, count: filtered.length });
});

app.delete("/api/conversations", (req, res) => {
  saveServerConversations([]);
  res.json({ success: true });
});

// Chat endpoint supporting Server-Sent Events (SSE) streaming with multi-model failover
app.post("/api/chat", async (req, res) => {
  const { message, history = [], studyMode = "general", stream = true } = req.body;

  // 1. Input Validation
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Message cannot be empty." });
    return;
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 5000) {
    res.status(400).json({
      error: "Message is too long. Please limit your question to 5,000 characters.",
    });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getAiClient();
  } catch (err: any) {
    res.status(503).json({ error: err.message });
    return;
  }

  // Build system instruction combining core personality with mode instructions
  const modePrompt = MODE_INSTRUCTIONS[studyMode] || "";
  const systemInstruction = modePrompt
    ? `${EDUMIND_SYSTEM_INSTRUCTION}\n\nSpecific Study Mode Context (${studyMode}): ${modePrompt}`
    : EDUMIND_SYSTEM_INSTRUCTION;

  // Format contents for @google/genai SDK using robust turn-alternating normalization
  const contents = formatContentsForGemini(Array.isArray(history) ? history : [], trimmedMessage);

  if (stream) {
    // Set SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    });
    // Immediately send keepalive ping so the connection opens without buffering delay
    res.write(": keepalive\n\n");

    let clientDisconnected = false;
    res.on("close", () => {
      if (!res.writableEnded) {
        clientDisconnected = true;
      }
    });

    let streamSuccess = false;
    let lastError: any = null;

    // Try each candidate model until one succeeds
    for (const model of CANDIDATE_MODELS) {
      if (clientDisconnected) break;
      for (let attempt = 0; attempt < 2; attempt++) {
        if (clientDisconnected) break;
        try {
          const responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          for await (const chunk of responseStream) {
            if (clientDisconnected) break;
            const text = chunk.text || "";
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
              if (typeof (res as any).flush === "function") {
                (res as any).flush();
              }
            }
          }

          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify({ done: true, model })}\n\n`);
            res.end();
          }
          streamSuccess = true;
          break; // Successfully completed
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${model} streaming error (attempt ${attempt + 1}):`, err?.status || err?.message?.slice?.(0, 100));
          if (attempt === 0 && isTransientError(err) && !clientDisconnected) {
            await sleep(parseRetryDelay(err));
            continue;
          }
          break; // Move to next model
        }
      }
      if (streamSuccess) break;
    }

    if (!streamSuccess && !clientDisconnected) {
      console.log(`Live models at capacity. Delivering EduMind curriculum study answer for query: "${trimmedMessage.slice(0, 60)}"`);
      const fallbackAnswer = getCurriculumStudyAnswer(trimmedMessage, studyMode);
      // Stream the curriculum fallback response smoothly
      const chunks = fallbackAnswer.match(/.{1,45}/gs) || [fallbackAnswer];
      for (const chunk of chunks) {
        if (clientDisconnected) break;
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        if (typeof (res as any).flush === "function") {
          (res as any).flush();
        }
        await sleep(18);
      }
      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ done: true, model: "edumind-curriculum-engine" })}\n\n`);
        res.end();
      }
    }
  } else {
    // Non-streaming fallback mode
    let lastError: any = null;
    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          res.json({ text: response.text || "", model });
          return;
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${model} non-stream error (attempt ${attempt + 1}):`, err?.status || err?.message?.slice?.(0, 100));
          if (attempt === 0 && isTransientError(err)) {
            await sleep(parseRetryDelay(err));
            continue;
          }
          break;
        }
      }
    }

    // High quality non-stream academic fallback
    const fallbackAnswer = getCurriculumStudyAnswer(trimmedMessage, studyMode);
    res.json({ text: fallbackAnswer, model: "edumind-curriculum-engine" });
  }

});

// Auto-generate a clean, concise 2-4 word academic title for a conversation
app.post("/api/generate-title", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    res.json({ title: "Study Session" });
    return;
  }

  try {
    const ai = getAiClient();
    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Create a concise 2 to 4 word title capturing the academic subject or question below. Do not use quotes, punctuation, or words like "question about" or "how to". Respond ONLY with the title.\n\nInput: ${message.slice(0, 500)}`,
        });
        const title = (response.text || "").trim().replace(/^["']|["']$/g, "");
        if (title && title.length < 50) {
          res.json({ title });
          return;
        }
      } catch {
        // try next model
      }
    }
  } catch {
    // fallback
  }

  // Fallback title
  res.json({ title: message.slice(0, 32).trim() + (message.length > 32 ? "..." : "") });
});

// Interactive Flashcards Generation Endpoint (Structured JSON with Curriculum Fallback)
app.post("/api/study-tools/flashcards", async (req, res) => {
  const { topic, context } = req.body;
  if (!topic && !context) {
    res.status(400).json({ error: "Please provide a topic or context to generate flashcards." });
    return;
  }

  const cleanTopic = (topic || "Computer Science").trim();

  try {
    const ai = getAiClient();
    const prompt = `Generate 4 to 6 high-yield study flashcards for this academic topic. Each card must have a clear question/prompt (front), a concise accurate answer (back), and an optional helpful hint.
Topic: ${cleanTopic}
${context ? `Context to base cards on: ${context.slice(0, 3000)}` : ""}`;

    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    hint: { type: Type.STRING },
                  },
                  required: ["front", "back"],
                },
              },
            },
          });

          const rawText = response.text || "[]";
          const cards = JSON.parse(rawText);
          if (Array.isArray(cards) && cards.length > 0) {
            const flashcards = cards.map((c: any, i: number) => ({
              id: `fc-${Date.now()}-${i}`,
              front: c.front,
              back: c.back,
              hint: c.hint || "",
            }));

            res.json({ flashcards, modelUsed: model });
            return;
          }
        } catch (err: any) {
          console.warn(`Flashcards generation failed with model ${model} (attempt ${attempt + 1}):`, err?.status || err?.message?.slice?.(0, 100));
          if (attempt === 0 && isTransientError(err)) {
            await sleep(parseRetryDelay(err));
            continue;
          }
          break; // move to next model
        }
      }
    }
  } catch (err: any) {
    console.warn("AI generation exception for flashcards, falling back to curriculum:", err?.message?.slice?.(0, 100));
  }

  // Graceful fallback to verified university curriculum knowledge base
  console.log(`Providing curriculum fallback flashcards for topic "${cleanTopic}"`);
  const fallbackCards = getCurriculumFlashcards(cleanTopic, context);
  res.json({
    flashcards: fallbackCards,
    isCurriculumFallback: true,
    notice: `Active Recall Cards loaded from EduMind Academic Knowledge Base for "${cleanTopic}".`,
  });
});

// Interactive Multiple-Choice Quiz Generation Endpoint (Structured JSON with Curriculum Fallback)
app.post("/api/study-tools/quiz", async (req, res) => {
  const { topic, context } = req.body;
  if (!topic && !context) {
    res.status(400).json({ error: "Please provide a topic or context to generate a quiz." });
    return;
  }

  const cleanTopic = (topic || "Computer Science").trim();

  try {
    const ai = getAiClient();
    const prompt = `Generate 3 to 4 multiple-choice quiz questions to test student comprehension on this topic.
Topic: ${cleanTopic}
${context ? `Context: ${context.slice(0, 3000)}` : ""}

For each question provide:
- question: the question text
- options: array of 4 possible answer strings
- correctIndex: 0-based integer index (0 to 3) of the correct answer
- explanation: brief explanation of why that answer is correct and why others are wrong.`;

    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ["question", "options", "correctIndex", "explanation"],
                },
              },
            },
          });

          const rawText = response.text || "[]";
          const items = JSON.parse(rawText);
          if (Array.isArray(items) && items.length > 0) {
            const questions = items.map((q: any, i: number) => ({
              id: `qz-${Date.now()}-${i}`,
              question: q.question,
              options: q.options || [],
              correctIndex: q.correctIndex,
              explanation: q.explanation || "",
            }));

            res.json({ questions, modelUsed: model });
            return;
          }
        } catch (err: any) {
          console.warn(`Quiz generation failed with model ${model} (attempt ${attempt + 1}):`, err?.status || err?.message?.slice?.(0, 100));
          if (attempt === 0 && isTransientError(err)) {
            await sleep(parseRetryDelay(err));
            continue;
          }
          break; // move to next model
        }
      }
    }
  } catch (err: any) {
    console.warn("AI generation exception for quiz, falling back to curriculum:", err?.message?.slice?.(0, 100));
  }

  // Graceful fallback to verified university curriculum knowledge base
  console.log(`Providing curriculum fallback quiz for topic "${cleanTopic}"`);
  const fallbackQuestions = getCurriculumQuiz(cleanTopic, context);
  res.json({
    questions: fallbackQuestions,
    isCurriculumFallback: true,
    notice: `Practice Quiz loaded from EduMind Academic Knowledge Base for "${cleanTopic}".`,
  });
});

// Helper for friendly error messages
function formatFriendlyError(error: any): string {
  const errorMessage = error?.message || String(error || "");
  if (
    errorMessage.includes("429") ||
    errorMessage.includes("RESOURCE_EXHAUSTED") ||
    errorMessage.toLowerCase().includes("quota")
  ) {
    return "Google AI service is momentarily at capacity or rate-limited. Please wait a few seconds and click Retry.";
  }
  if (
    errorMessage.includes("503") ||
    errorMessage.includes("UNAVAILABLE") ||
    errorMessage.includes("high demand")
  ) {
    return "Google AI servers are currently experiencing temporary high traffic. Please click Retry Question to resend.";
  }
  if (errorMessage.includes("API key not valid") || errorMessage.includes("INVALID_ARGUMENT")) {
    return "Gemini API key is invalid. Please check your key in AI Studio Secrets.";
  }
  if (errorMessage.includes("SAFETY") || errorMessage.includes("blocked")) {
    return "The query could not be completed due to safety guidelines. Please rephrase.";
  }
  return "An unexpected error occurred while communicating with the AI. Please click Retry Question.";
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMind AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
