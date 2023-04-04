import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const Header = () => {
  const { user, error, isLoading } = useUser();

  let rightMenu;

  if (error) {
    rightMenu = <div>error</div>;
  }
  // If it's loading
  else if (isLoading) {
    rightMenu = <div>loading</div>;
  }
  // If logged
  else if (user) {
    rightMenu = (
      <div className='flex items-center space-x-5'>
        <img
          alt='profile'
          className='rounded-full w-8 h-8'
          src={user.picture ? user.picture : ''}
        />
        <Link
          href='/api/auth/logout'
          className='inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-sm mt-4 md:mt-0'>
          logout
        </Link>
      </div>
    );
  }
  // If session or token expired
  else {
    rightMenu = (
      <Link
        href='/api/auth/login'
        className='inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0'>
        login
      </Link>
    );
  }

  return (
    <header className='text-current body-font fixed w-full'>
      <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
        <Link
          href='/'
          className='flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0'>
          <svg
            className='w-10 h-10 text-white p-2 bg-blue-500 rounded-full'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'></path>
          </svg>
          <h4 className='m-0 ml-4'>iamtan</h4>
        </Link>
        <nav className='md:ml-auto flex flex-wrap items-center text-base justify-center'>
          {rightMenu}
        </nav>
      </div>
    </header>
  );
};

export default Header;
