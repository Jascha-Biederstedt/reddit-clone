import { getSession } from 'next-auth/react';

import prisma from 'lib/prisma';

const handler = async (req, res) => {
  if (req.method !== 'POST') return res.status(501).end();

  const session = await getSession({ req });

  if (!session) return res.status(401).send({ message: 'Not logged in' });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return res.status(401).send({ message: 'User not found' });

  if (req.method === 'POST') {
    await prisma.vote.upsert({
      where: {
        authorId_postId: {
          authorId: user.id,
          postId: req.body.post,
        },
      },
      update: {
        up: req.body.up,
      },
      create: {
        up: req.body.up,
        postId: req.body.post,
        authorId: user.id,
      },
    });

    res.end();
  }
};

export default handler;
