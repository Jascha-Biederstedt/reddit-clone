import { getSession } from 'next-auth/react';

import prisma from 'lib/prisma';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) return res.status(401).send({ message: 'Not logged in' });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  console.log('TEST');

  if (!user) return res.status(401).send({ message: 'User not found' });

  if (req.method === 'POST') {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        subreddit: {
          connect: {
            name: req.body.subreddit_name,
          },
        },
        author: {
          connect: { id: user.id },
        },
      },
    });

    res.send(post);
    return;
  }
};

export default handler;
