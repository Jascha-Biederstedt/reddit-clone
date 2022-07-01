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

  if (!user) return res.status(501).send({ message: 'User not found' });

  if (req.method === 'POST') {
    await prisma.comment.create({
      data: {
        content: req.body.content,
        authorId: user.id,
        postId: req.body.post,
      },
    });
  }

  res.end();
};

export default handler;
