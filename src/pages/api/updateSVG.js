import pb from "../../utils/pb.js";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, name, code_svg, chat_history } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing record ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedRecord = await pb.collection("svgs").update(id, {
      name: name || "untitled",
      code_svg: code_svg || "<svg></svg>",
      chat_history: chat_history || "[]",
    });

    return new Response(
      JSON.stringify({ success: true, id: updatedRecord.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("updateSVG error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
