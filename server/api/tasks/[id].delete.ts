// server/api/tasks/[id].delete.ts  (DELETE /api/tasks/:id)
import { useDb } from "~/server/db";
import { tasks } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const id = Number(getRouterParam(event, "id"));
  const db = useDb();

  const [deleted] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning();

  if (!deleted) {
    throw createError({ statusCode: 404, message: "Task not found" });
  }

  return { ok: true };
});
