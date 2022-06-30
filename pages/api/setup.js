import { getSession } from 'next-auth/react';

import prisma from 'lib/prisma';

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.end();
  if (req.method !== 'POST') return res.end();

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.end();
};

export default handler;
