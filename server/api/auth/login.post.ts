import { useDb } from "~~/server/db";
import { loginSchema } from "~~/server/db/validators";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0].message,
    });
  }

  const db = useDb();
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, parsed.data.email),
  });

  if (!user) {
    throw createError({ statusCode: 401, message: "Invalid credentials" });
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Invalid credentials" });
  }

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name },
  });

  return { user: { id: user.id, email: user.email, name: user.name } };
});
