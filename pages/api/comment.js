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
    const data = {
      content: req.body.content,
      post: {
        connect: {
          id: req.body.post,
        },
      },
      author: {
        connect: { id: user.id },
      },
    };

    if (req.body.comment) {
      data.parent = {
        connect: {
          id: req.body.comment,
        },
      };
    }

    const comment = await prisma.comment.create({
      data,
    });
  }

  res.end();
};

export default handler;
