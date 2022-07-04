import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import prisma from 'lib/prisma';
import { getSubreddit, getPostsFromSubreddit } from 'lib/data.js';
import Posts from 'components/Posts';
import Spinner from 'components/Spinner';

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
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Spinner />;

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

      {session && (
        <div className='border border-3 border-black p-10 mx-20 my-10'>
          <input
            placeholder='Create post'
            className='border-gray-800 border-2 p-4 w-full'
            onClick={() => {
              router.push(`/r/${subreddit.name}/submit`);
            }}
          ></input>
        </div>
      )}

      <Posts posts={posts} />
    </>
  );
};

export default Subreddit;
