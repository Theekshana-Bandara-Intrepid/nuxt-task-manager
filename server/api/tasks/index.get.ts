// server/api/tasks/index.get.ts  (GET /api/tasks)
import { useDb } from "~~/server/db";
import { tasks } from "~~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const db = useDb();

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session.user.id))
    .orderBy(desc(tasks.createdAt));

  return userTasks;
});
