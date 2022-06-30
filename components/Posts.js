import React from 'react';

import Post from 'components/Post';

const Posts = ({ posts }) => {
  if (!posts) return null;

  return (
    <>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </>
  );
};

export default Posts;
