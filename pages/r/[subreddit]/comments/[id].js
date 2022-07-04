import Link from 'next/link';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import prisma from 'lib/prisma';
import { getPost, getSubreddit, getVote, getVotes } from 'lib/data.js';
import timeago from 'lib/timeago';
import NewComment from 'components/NewComment';
import Spinner from 'components/Spinner';
import Comments from 'components/Comments';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const subreddit = await getSubreddit(prisma, context.params.subreddit);
  let post = await getPost(prisma, parseInt(context.params.id));
  post = JSON.parse(JSON.stringify(post));

  let votes = await getVotes(prisma, parseInt(context.params.id));
  votes = JSON.parse(JSON.stringify(votes));

  let vote = await getVote(
    prisma,
    parseInt(context.params.id),
    session?.user.id
  );
  vote = JSON.parse(JSON.stringify(vote));

  return {
    props: {
      subreddit,
      post,
      votes,
      vote,
    },
  };
}

const Post = ({ subreddit, post, votes, vote }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Spinner />;

  if (!post) return <p className='text-center p-5'>Post does not exist 😞</p>;

  const sendVote = async (event, up) => {
    event.preventDefault();

    await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: post.id,
        up,
      }),
    });

    router.reload(window.location.pathname);
  };

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

      <div className='flex flex-row mb-4  px-10 justify-center'>
        <div className='flex flex-col mb-4 border-t border-l border-b border-3 border-black p-10 bg-gray-200 my-10 text-center'>
          <div
            className='cursor-pointer'
            onClick={event => sendVote(event, true)}
          >
            {vote?.up ? '⬆' : '↑'}
          </div>
          <div>{votes}</div>
          <div
            className='cursor-pointer'
            onClick={event => sendVote(event, false)}
          >
            {!vote ? '↓' : vote?.up ? '↓' : '⬇'}
          </div>
        </div>

        <div className='flex flex-col mb-4 border-t border-r border-b border-3 border-black p-10 pl-0 bg-gray-200 my-10'>
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
          <Comments comments={post.comments} post={post} />
        </div>
      </div>
    </>
  );
};

export default Post;
