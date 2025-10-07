import pb from "../../utils/pb.js";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("updateSVG received:", body);
    
    if (!body.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing record ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedRecord = await pb.collection("svgs").update(body.id, {
      name: body.name || "untitled",
      code_svg:  body.code_svg || "<svg></svg>",
      chat_history:  body.chat_history || "[]",
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
