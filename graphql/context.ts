import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { UserSession } from '@/utils/types/UserSession';
import { getCookie } from 'cookies-next';
import { isNil } from 'lodash';

export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const session = await getSession(req, res);
  const token = getCookie('X-3X-4X', { req, res });
  // if the user is not logged in, return an empty object
  if (isNil(session) && isNil(token)) return { req, res };

  let user = {} as UserSession,
    accessToken: string | undefined;

  if (!isNil(session)) {
    accessToken = session.accessToken;
    user.email = session.user['email'];

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
  } else if (!isNil(token)) {
    let internalUser = await prisma.user.findFirst({
      where: {
        id: token as string
      }
    });
    if (internalUser) {
      user.email = internalUser.email;
      user.id = internalUser.id;
    }
  }

  return {
    user,
    accessToken,
    req,
    res
  };
}
