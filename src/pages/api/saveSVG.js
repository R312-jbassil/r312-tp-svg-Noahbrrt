
import PocketBase from "pocketbase";

const PB_URL = import.meta.env.PB_URL || "http://127.0.0.1:8090";

export const POST = async ({ request }) => {
  try {
    const { name = "", code = "" } = await request.json();

    if (!name || !code) {
      return new Response("Missing data", { status: 400 });
    }

    const pb = new PocketBase(PB_URL);

    const record = await pb.collection("svgs").create({ name, code });

    return new Response(JSON.stringify({ id: record.id }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
};
