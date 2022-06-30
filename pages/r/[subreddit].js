import Link from 'next/link';

import prisma from 'lib/prisma';
import { getSubreddit, getPostsFromSubreddit } from 'lib/data.js';
import Posts from 'components/Posts';

export const getServerSideProps = async ({ params }) => {
  const subreddit = await getSubreddit(prisma, params.subreddit);
  let posts = await getPostsFromSubreddit(prisma, params.subreddit);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      subreddit,
      posts,
    },
  };
};

const Subreddit = ({ subreddit, posts }) => {
  if (!subreddit) {
    return <p className='text-center p-5'>Subreddit does not exist 😞</p>;
  }

  return (
    <>
      <Link href={`/`}>
        <a className='text-center p-5 underline block'>
          🔙 back to the homepage
        </a>
      </Link>
      <p className='text-center p-5'>/r/{subreddit.name}</p>
      <Posts posts={posts} />
    </>
  );
};

export default Subreddit;
