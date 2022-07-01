import React from 'react';

import timeago from 'lib/timeago';

const Comment = ({ comment }) => {
  return (
    <div className='mt-8'>
      <p>{comment.author.name}</p>
      <p className='mb-2'>{timeago.format(new Date(comment.createdAt))}</p>
      <p>{comment.content}</p>
    </div>
  );
};

const Comments = ({ comments }) => {
  if (!comments) return null;

  return (
    <>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </>
  );
};

export default Comments;
