import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Spinner from 'components/Spinner';

const Setup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');

  if (status === 'loading') return <Spinner />;

  if (!session || !session.user) {
    router.push('/');
    return null;
  }

  if (status !== 'loading' && session && session.user.name) {
    router.push('/');
  }

  const handleSubmit = async event => {
    event.preventDefault();

    await fetch('/api/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    session.user.name = name;
    router.push('/');
  };

  return (
    <form className='mt-10 ml-20' onSubmit={event => handleSubmit(event)}>
      <div className='flex-1 mb-5'>
        <div className='flex-1 mb-5'>Choose a username</div>
        <input
          type='text'
          name='name'
          value={name}
          onChange={event => setName(event.target.value)}
          className='border p-1'
          required
          pattern='\w*'
          title='Numbers or letters or _ only'
          placeholder='Numbers or letters or _ only'
          minlength='5'
        />
      </div>

      <button className='border px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover'>
        Save
      </button>
    </form>
  );
};

export default Setup;
