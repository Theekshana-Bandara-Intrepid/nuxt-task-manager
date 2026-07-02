// server/api/auth/register.post.ts
import { useDb } from "~/server/db";
import { users } from "~/server/db/schema";
import { registerSchema } from "~/server/db/validators";
import { hashPassword } from "~/server/utils/password";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0].message,
    });
  }

  const db = useDb();
  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, parsed.data.email),
  });

  if (existing) {
    throw createError({ statusCode: 409, message: "Email already registered" });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db
    .insert(users)
    .values({
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
    })
    .returning({ id: users.id, email: users.email, name: users.name });

  await setUserSession(event, { user });
  return { user };
});
