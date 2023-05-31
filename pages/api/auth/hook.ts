import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, username, name, surname, picture, secret } = req.body;
  if (req.method !== 'POST') {
    return res.status(403).json({ message: 'Method not allowed' });
  }
  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return res.status(403).json({ message: `You must provide the secret 🤫` });
  }
  if (email) {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (user) {
      return res.status(200).json({
        message: `User with email: ${email} has existed already!`
      });
    }

    await prisma.user.create({
      data: {
        name: name ?? '',
        surname: surname ?? '',
        username: username ?? '',
        email: email,
        profile: {
          create: {
            bio: 'Xin chào, mình mới vào đây',
            accountType: 'READER',
            activationStatus: 'COMPLETED',
            picture
          }
        }
      }
    });
    return res.status(200).json({
      message: `User with email: ${email} has been created successfully!`
    });
  }
  return res.status(500).json({
    message: `Invalid Email!`
  });
};

export default handler;
