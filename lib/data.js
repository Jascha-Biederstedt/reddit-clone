export const getPost = async (prisma, id) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      comments: {
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          author: true,
        },
      },
    },
  });

  return post;
};

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

export const getVote = async (prisma, post_id, user_id) => {
  const vote = await prisma.vote.findMany({
    where: {
      postId: post_id,
      authorId: user_id,
    },
  });

  if (vote.length === 0) return null;

  return vote[0];
};

export const getVotes = async (prisma, post) => {
  const upvotes = await prisma.vote.count({
    where: {
      postId: post,
      up: true,
    },
  });

  const downvotes = await prisma.vote.count({
    where: {
      postId: post,
      up: false,
    },
  });

  return upvotes - downvotes;
};
