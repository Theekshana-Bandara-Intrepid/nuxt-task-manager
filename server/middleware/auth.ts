// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // Only protect /api/tasks routes
  if (!event.path.startsWith("/api/tasks")) return;

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
