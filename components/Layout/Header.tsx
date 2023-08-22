import React from 'react';
import Link from 'next/link';
import { Menu, Button, Avatar, rem, Group } from '@mantine/core';
import {
  IconSettings,
  IconMessageCircle,
  IconChevronDown,
  IconLogout,
  IconUser
} from '@tabler/icons-react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { useMantineTheme, useMantineColorScheme, ActionIcon } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { classNames } from '@/utils';

type Props = {
  fixed?: boolean;
};

const Header: React.FC<Props> = ({ fixed = true }) => {
  const theme = useMantineTheme();
  const { user, error, isLoading } = useUser();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDarkEnabled = colorScheme === 'dark';

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
        <Menu shadow='md' width={200} position='bottom-end'>
          <Menu.Target>
            <Button variant='light' px={rem(4)} color='gray'>
              <Group>
                <Avatar color='cyan' radius='xl' size={rem(28)}>
                  {user.nickname}
                </Avatar>
                <IconChevronDown size={rem(16)} />
              </Group>
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
            <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
            <Menu.Item color='red' icon={<IconLogout size={14} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  }
  // If session or token expired
  else {
    rightMenu = (
      <Group>
        <Button variant='light' px={rem(4)} color='gray'>
          <IconUser size={rem(16)} />
          <Link
            href='/api/auth/login'
            className='inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base'>
            login
          </Link>
        </Button>
      </Group>
    );
  }

  rightMenu = null;

  return (
    <header
      className={classNames('text-main body-font w-full z-50', fixed ? 'fixed' : '')}
      style={{
        backgroundColor: isDarkEnabled ? theme.colors.dark[8] : theme.colors.gray[1]
      }}>
      <div className='container mx-auto flex flex-nowrap px-5 items-center h-[60px]'>
        <nav className='flex items-center text-base h-full'>
          <Link href='/' className='flex title-font font-medium items-center mr-2 md:mr-8'>
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
            <h4 className='m-0 ml-4'>Website này nói về gì đó</h4>
          </Link>
          {/* <Link
            href='/topics'
            className='h-full flex items-center px-2 py-2 text-md mr-2 md:mr-8 link'>
            chủ đề
          </Link>
          <Link href='/new-post' className='h-full flex items-center px-2 py-2 text-md link'>
            viết bài
          </Link> */}
        </nav>
        <nav className='ml-auto flex flex-wrap items-center text-base justify-center'>
          <span className='mr-4'>{isDarkEnabled ? 'Này là tối' : 'Này là sáng'}</span>
          <ActionIcon
            variant='outline'
            color={isDarkEnabled ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme(isDarkEnabled ? 'light' : 'dark')}
            title='Toggle color scheme'
            mr={rem(16)}>
            {isDarkEnabled ? <IconSun size={rem(16)} /> : <IconMoonStars size={rem(16)} />}
          </ActionIcon>
          {rightMenu}
        </nav>
      </div>
    </header>
  );
};

export default Header;
