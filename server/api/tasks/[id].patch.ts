// server/api/tasks/[id].patch.ts  (PATCH /api/tasks/:id)
import { useDb } from "~/server/db";
import { tasks } from "~/server/db/schema";
import { updateTaskSchema } from "~/server/db/validators";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0].message,
    });
  }

  const db = useDb();
  const [task] = await db
    .update(tasks)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning();

  if (!task) {
    throw createError({ statusCode: 404, message: "Task not found" });
  }

  return task;
});
