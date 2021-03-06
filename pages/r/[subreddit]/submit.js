import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import prisma from 'lib/prisma';
import { getSubreddit } from 'lib/data.js';
import Spinner from 'components/Spinner';

export const getServerSideProps = async ({ params }) => {
  const subreddit = await getSubreddit(prisma, params.subreddit);

  return {
    props: {
      subreddit,
    },
  };
};

const NewPost = ({ subreddit }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  if (status === 'loading') return <Spinner />;

  if (!session) return <p className='text-center p-5'>Not logged in 😞</p>;

  if (!subreddit)
    return <p className='text-center p-5'>Subreddit does not exist 😞</p>;

  const handleSubmit = async event => {
    event.preventDefault();

    if (!title) {
      alert('Enter a title');
      return;
    }
    if (!content && !image) {
      alert('Enter some text in the post');
      return;
    }

    const body = new FormData();
    body.append('image', image);
    body.append('title', title);
    body.append('content', content);
    body.append('subreddit_name', subreddit.name);

    const res = await fetch('/api/post', {
      method: 'POST',
      body,
    });

    router.push(`/r/${subreddit.name}`);
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
        <div className='flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 my-10'>
          <form
            className='flex flex-col '
            onSubmit={event => handleSubmit(event)}
          >
            <h2 className='text-2xl font-bold mb-8'>Create a post</h2>
            <input
              className='border border-gray-700 border-b-0 p-4 w-full text-lg font-medium bg-transparent outline-none  '
              rows={1}
              cols={50}
              placeholder='The post title'
              onChange={event => setTitle(event.target.value)}
            />
            <textarea
              className='border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none  '
              rows={5}
              cols={50}
              placeholder='The post content'
              onChange={event => setContent(event.target.value)}
            />
            <div className='text-sm text-gray-600 '>
              <label className='relative font-medium cursor-pointer underline my-3 block'>
                {!imageURL && <p className=''>Upload an image</p>}
                <img src={imageURL} />
                <input
                  name='image'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={event => {
                    if (event.target.files && event.target.files[0]) {
                      if (event.target.files[0].size > 3072000) {
                        alert('Maximum size allowed is 3MB');
                        return false;
                      }
                      setImage(event.target.files[0]);
                      setImageURL(URL.createObjectURL(event.target.files[0]));
                    }
                  }}
                />
              </label>
            </div>
            <div className='mt-5'>
              <button className='border border-gray-700 px-8 py-2 mt-0 mr-8 font-bold '>
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPost;
