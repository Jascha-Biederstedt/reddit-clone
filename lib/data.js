export const getPost = async (prisma, id) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      comments: {
        where: {
          parentId: null,
        },
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

  if (post.comments) {
    post.comments = await fetchCommentsOfComments(prisma, post.comments);
  }

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

const fetchCommentsOfComments = async (prisma, comments) => {
  const fetchCommentsOfComment = async (prisma, comment) => {
    comment.comments = await getComments(prisma, comment.id);
    return comment;
  };

  return Promise.all(
    comments.map(comment => {
      comment = fetchCommentsOfComment(prisma, comment);
      return comment;
    })
  );
};

const getComments = async (prisma, parent_id) => {
  let comments = await prisma.comment.findMany({
    where: {
      parentId: parent_id,
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

  if (comments.length) {
    comments = await fetchCommentsOfComments(prisma, comments);
  }

  return comments;
};
