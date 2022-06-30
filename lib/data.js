export const getPosts = async prisma => {
  const posts = await prisma.post.findMany({
    where: {},
    orderBy: {
      id: 'desc',
    },
    include: {
      author: true,
    },
  });

  return posts;
};

export const getSubreddit = async (prisma, name) => {
  return await prisma.subreddit.findUnique({
    where: {
      name,
    },
  });
};

export const getPostsFromSubreddit = async (prisma, subreddit) => {
  const posts = await prisma.post.findMany({
    where: {
      subredditName: subreddit,
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
    include: {
      author: true,
    },
  });

  return posts;
};
