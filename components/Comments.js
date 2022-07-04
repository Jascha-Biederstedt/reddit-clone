import React from 'react';
import { useState } from 'react';

import timeago from 'lib/timeago';
import NewComment from 'components/NewComment';

const Comment = ({ comment, post }) => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className='mt-8'>
      <p>{comment.author.name}</p>
      <p className='mb-2'>{timeago.format(new Date(comment.createdAt))}</p>
      <p>{comment.content}</p>
      {showReply ? (
        <div className='pl-10'>
          <NewComment comment={comment} post={post} />
        </div>
      ) : (
        <p
          className='underline text-sm cursor-pointer mt-2'
          onClick={() => setShowReply(true)}
        >
          reply
        </p>
      )}
    </div>
  );
};

const Comments = ({ comments, post }) => {
  if (!comments) return null;

  return (
    <>
      {comments.map((comment, index) => (
        <div key={index}>
          <Comment comment={comment} post={post} />
          {comment.comments && (
            <div className='pl-10'>
              <Comments comments={comment.comments} post={post} />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Comments;
