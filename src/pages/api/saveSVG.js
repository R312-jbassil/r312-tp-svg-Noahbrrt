import pb from "../../utils/pb.js";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("saveSVG received:", body);

    const name = body.name || body.nom || "untitled";
    const code_svg = body.code_svg || body.code || "<svg></svg>";
    const chat_history = body.chat_history || "[]";

    if (!name || !code_svg) {
      return new Response(JSON.stringify({ success: false, error: "Missing name or code_svg" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const record = await pb.collection("svgs").create({
      name,
      code_svg,
      chat_history,
    });

    console.log("SVG saved with ID:", record.id);

    return new Response(JSON.stringify({ success: true, id: record.id }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in saveSVG:", error);
    return new Response(JSON.stringify({ success: false, error: error?.message || String(error) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
};
