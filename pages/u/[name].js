import Link from 'next/link';

import prisma from 'lib/prisma';
import { getUser, getPostsFromUser } from 'lib/data.js';
import Posts from 'components/Posts';

export const getServerSideProps = async ({ params }) => {
  let user = await getUser(prisma, params.name);
  user = JSON.parse(JSON.stringify(user));

  let posts = await getPostsFromUser(prisma, params.name);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      user,
      posts,
    },
  };
};

const Profile = ({ user, posts }) => {
  if (!user) return <p className='text-center p-5'>User does not exist 😞</p>;

  return (
    <>
      <Link href={`/`}>
        <a className='text-center p-5 underline block'>
          🔙 back to the homepage
        </a>
      </Link>
      <p className='text-center p-5'>/u/{user.name}</p>

      <Posts posts={posts} />
    </>
  );
};

export default Profile;
