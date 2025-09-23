import { OpenAI } from "openai";

const BASE_URL = import.meta.env.HF_URL || "https://api.hf.example"; 
const ACCESS_TOKEN = import.meta.env.HF_TOKEN_2 || import.meta.env.HF_TOKEN || "";

export const POST = async ({ request }) => {
  try {
    // Debug: affiche une info sur la requête (ne pas spammer en prod)
    console.log("generateSVG request received");

    // On attend que le front envoie un tableau de messages [{role, content}, ...]
    const messages = await request.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Expected an array of messages" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = new OpenAI({
      baseURL: BASE_URL,
      apiKey: ACCESS_TOKEN,
    });

    // Message système qui guide le modèle
    const SystemMessage = {
      role: "system",
      content:
        "You are an SVG code generator. Generate SVG code for the following messages. Make sure to include ids for each part of the generated SVG.",
    };

    // Remplacez le nom du modèle ici par celui que vous utilisez (env var possible)
    const MODEL_NAME = import.meta.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct:novita";

    const chatCompletion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [SystemMessage, ...messages],
    });

    const message = chatCompletion.choices?.[0]?.message || { role: "assistant", content: "" };
    console.log("Generated message (raw):", message);

    // Extraire uniquement le <svg>...</svg> si présent
    const svgMatch = (message.content || "").match(/<svg[\s\S]*?<\/svg>/i);
    const svgOnly = svgMatch ? svgMatch[0] : "";

    // Retourner l'objet message mais en remplaçant content par le svg extrait
    const outMessage = {
      role: message.role || "assistant",
      content: svgOnly,
    };

    return new Response(JSON.stringify({ svg: outMessage }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generateSVG error:", err);
    return new Response(JSON.stringify({ error: "Server error", detail: err?.message || err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
