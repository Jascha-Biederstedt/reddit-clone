import Link from 'next/link';
import { useSession } from 'next-auth/react';

import prisma from 'lib/prisma';
import { getPost, getSubreddit } from 'lib/data.js';
import timeago from 'lib/timeago';
import NewComment from 'components/NewComment';
import Spinner from 'components/Spinner';
import Comments from 'components/Comments';

export const getServerSideProps = async ({ params }) => {
  const subreddit = await getSubreddit(prisma, params.subreddit);
  let post = await getPost(prisma, parseInt(params.id));
  post = JSON.parse(JSON.stringify(post));

  return {
    props: {
      subreddit,
      post,
    },
  };
};

const Post = ({ subreddit, post }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Spinner />;

  if (!post) return <p className='text-center p-5'>Post does not exist 😞</p>;

  return (
    <>
      <Link href={`/`}>
        <a className='text-center p-5 underline block'>
          🔙 back to the homepage
        </a>
      </Link>
      <Link href={`/r/${subreddit.name}`}>
        <a className='text-center p-5 underline block'>
          🔙 back to /r/{subreddit.name}
        </a>
      </Link>

      <div className='flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 mx-20 my-10'>
        <div className='flex flex-shrink-0 pb-0 '>
          <div className='flex-shrink-0 block group '>
            <div className='flex flex-col text-gray-800'>
              <div>Posted by {post.author.name} </div>
              <div>{timeago.format(new Date(post.createdAt))}</div>
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <a className='flex-shrink text-2xl font-bold color-primary width-auto'>
            {post.title}
          </a>
          <p className='flex-shrink text-base font-normal color-primary width-auto mt-2'>
            {post.content}
          </p>
        </div>
        {session ? (
          <NewComment post={post} />
        ) : (
          <p className='mt-5'>
            <a className='mr-1 underline' href='/api/auth/signin'>
              Login
            </a>
            to add a comment
          </p>
        )}
        <Comments comments={post.comments} />
      </div>
    </>
  );
};

export default Post;
