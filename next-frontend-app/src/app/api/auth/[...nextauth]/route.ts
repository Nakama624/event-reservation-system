import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(
                    `${process.env.LARAVEL_API_URL}/api/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    },
                );

                const data = await res.json();

                if (!res.ok) {
                    return null;
                }

                return {
                    id: String(data.user.id),
                    name: data.user.name,
                    email: data.user.email,
                    isManager: Boolean(data.user.is_manager),
                    accessToken: data.token,
                    emailVerifiedAt: data.user.email_verified_at,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
                token.isManager = user.isManager;
                token.emailVerifiedAt = user.emailVerifiedAt;
            }

            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.id = token.id as string;
            session.user.isManager = token.isManager as boolean;
            session.user.emailVerifiedAt = token.emailVerifiedAt as
                | string
                | null;

            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
