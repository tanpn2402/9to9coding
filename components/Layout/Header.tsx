import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Switch } from '@headlessui/react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils';

const Header = () => {
  const { user, error, isLoading } = useUser();
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [enabled]);

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
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            <Menu.Button className='flex items-center  text-current hover:text-gray-500'>
              <img
                alt='profile'
                className='rounded-full w-8 h-8'
                src={user.picture ? user.picture : ''}
              />
              <ChevronDownIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'>
            <Menu.Items className='bg-white dark:bg-slate-500 text-main absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='px-1 py-1 '>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href='/profile'
                      className={`${
                        active ? 'bg-gray-500 text-white' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      my posts
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href='/profile/post'
                      className={`${
                        active ? 'bg-gray-500 text-white' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      my posts
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href='/api/auth/logout'
                      className={`${
                        active ? 'bg-red-500 text-white' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      logout
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    );
  }
  // If session or token expired
  else {
    rightMenu = (
      <Link
        href='/api/auth/login'
        className='inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0'>
        login
      </Link>
    );
  }

  return (
    <header className='bg-gray-100 dark:bg-[#191b1c] text-main body-font fixed w-full z-50'>
      <div className='container mx-auto flex flex-wrap p-5 py-2 flex-col md:flex-row items-center'>
        <Link href='/' className='flex title-font font-medium items-center mb-4 md:mb-0'>
          <svg
            className='w-8 h-8 text-white p-2 bg-blue-500 rounded-full'
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
          <span className='mr-4'>{enabled ? 'dark' : 'light'}</span>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={classNames(
              enabled ? 'bg-indigo-600' : 'bg-gray-200',
              'mr-8 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
            )}>
            <span className='sr-only'>use setting</span>
            <span
              aria-hidden='true'
              className={classNames(
                enabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            />
          </Switch>
          {rightMenu}
        </nav>
      </div>
    </header>
  );
};

export default Header;
