// src/middleware/index.js
import pb from "../utils/pb.js";

export const onRequest = async (context, next) => {
  const cookie = context.cookies.get("pb_auth")?.value;

  // 🔹 Si le cookie existe, on le charge dans l’authStore
  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    if (pb.authStore.isValid) {
      // Si valide, on ajoute l'utilisateur connecté dans locals
      context.locals.user = pb.authStore.record;
    }
  } 

  // 🔹 Pour toutes les routes API
  if (context.url.pathname.startsWith("/api/")) {
    if (!context.locals.user && context.url.pathname !== "/api/login") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return next();
  }

  // 🔹 Pour toutes les autres pages : rediriger vers /login si non connecté
  if (!context.locals.user) {
    if (context.url.pathname !== "/login" && context.url.pathname !== "/") {
      return Response.redirect(new URL("/login", context.url), 303);
    }
  }

  return next();
};
