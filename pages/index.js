import Head from 'next/head';

import prisma from 'lib/prisma';
import { getPosts } from 'lib/data';
import Posts from 'components/Posts';

export const getServerSideProps = async () => {
  let posts = await getPosts(prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      posts,
    },
  };
};

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Reddit Clone</title>
        <meta name='description' content='Reddit Clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Posts posts={posts} />
    </div>
  );
}
