// app/types/auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    name: string;
  }

  interface UserSession {
    user: User;
  }
}

export {};
