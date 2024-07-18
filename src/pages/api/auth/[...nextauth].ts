import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import {
  NODEMAILER_CONFIGURATION,
  prisma,
  sendVerificationRequest,
} from '../../../server';
import { isInitiallyAdmin } from '../../../server/services';
import { UserRole } from '@prisma/client';

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    EmailProvider({
      server: NODEMAILER_CONFIGURATION,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/connexion',
    error: '/connexion',
    verifyRequest: '/verification',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn callback:', { user, account, profile, email, credentials });
      if (account?.providerAccountId !== null) {
        await prisma.account.updateMany({
          where: {
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          },
          data: {
            updatedAt: new Date().toISOString(),
          },
        });
      }

      const isAllowedToSignIn = !user.disabled;
      if (isAllowedToSignIn) {
        return true;
      }
      return false;
    },
    async session({ session, user }) {
      console.log('session callback:', { session, user });
      const isAllowedToSignIn = !user.disabled;
      if (!isAllowedToSignIn) {
        throw new Error(); // Shouldn't happen?
      }

      await prisma.user.update({
        where: {
          id: Number(user.id),
        },
        data: {
          lastActivity: new Date().toISOString(),
        },
      });

      if (isInitiallyAdmin(user) && user.role !== UserRole.ADMINISTRATOR) {
        const newRole = UserRole.ADMINISTRATOR;
        await prisma.user.update({ where: { id: Number(user.id) }, data: { role: newRole } });
        user.role = newRole;
      }

      session.userId = Number(user.id);
      session.role = user.role;
      session.displayName = user.customName ? user.customName : user.name;
      session.displayEmail = user.customEmail ? user.customEmail : user.email;
      session.publicAccessToken = user.publicAccessToken;

      return session;
    },
  },
  events: {},
  debug: true, // Enable debugging
};

export default NextAuth(nextAuthOptions);