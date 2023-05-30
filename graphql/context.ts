import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { UserSession } from '@/utils/types/UserSession';

export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const session = await getSession(req, res);

  // if the user is not logged in, return an empty object
  if (!session || typeof session === 'undefined') return {};

  const { accessToken } = session;
  let user: UserSession = {
    id: '',
    email: session.user['email']
  };

  let internalUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: user['email']
      }
    }
  });

  if (internalUser) {
    user.id = internalUser.id;
  }

  return {
    user,
    accessToken
  };
}
