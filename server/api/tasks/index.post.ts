// server/api/tasks/index.post.ts  (POST /api/tasks)
import { useDb } from "~~/server/db";
import { tasks } from "~~/server/db/schema";
import { createTaskSchema } from "~~/server/db/validators";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const body = await readBody(event);
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0].message,
    });
  }

  const db = useDb();
  const [task] = await db
    .insert(tasks)
    .values({
      ...parsed.data,
      userId: session.user.id,
    })
    .returning();

  return task;
});
