import pb from "../../utils/pb";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, passwordConfirm } = body;

    if (!email || !password || !passwordConfirm) {
      return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
    }

    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
    });

    console.log("Utilisateur créé :", user);

    return new Response(JSON.stringify({ success: true, user }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erreur signup:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
};
