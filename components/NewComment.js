import React, { useState } from 'react';
import { useRouter } from 'next/router';

const NewComment = ({ post, comment }) => {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    if (!content) {
      alert('Enter some text in the comment');
      return;
    }

    await fetch('/api/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: post.id,
        content,
        comment: comment?.id,
      }),
    });

    router.reload(window.location.pathname);
  };

  return (
    <form
      className='flex flex-col mt-10 max-w-lg'
      onSubmit={event => handleSubmit(event)}
    >
      <textarea
        className='border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
        rows={2}
        cols={50}
        placeholder='Add a comment'
        onChange={event => setContent(event.target.value)}
      />
      <div className='mt-5'>
        <button className='border border-gray-700 px-8 py-2 mt-0 mr-8 font-bold '>
          Comment
        </button>
      </div>
    </form>
  );
};

export default NewComment;
