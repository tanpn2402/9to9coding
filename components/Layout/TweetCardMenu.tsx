import { useIdentity } from '@/utils/hooks/useIdentity';
import { Menu, ActionIcon, rem } from '@mantine/core';
import { Post, User } from '@prisma/client';
import { useRouter } from 'next/router';
import { IconDots, IconEdit, IconExternalLink, IconFlag, IconMaximize } from '@tabler/icons-react';

export const TweetCardMenu: React.FC<{
  author: User;
  post: Post;
}> = ({ author, post }) => {
  const router = useRouter();
  const user = useIdentity();
  return (
    <Menu withinPortal position='bottom-end' shadow='sm'>
      <Menu.Target>
        <ActionIcon>
          <IconDots size='1rem' />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {user?.id === author.id && (
          <Menu.Item
            icon={<IconEdit size={rem(14)} />}
            onClick={() => {
              router.push('/p/edit?id=' + post.id);
            }}>
            Chỉnh sửa
          </Menu.Item>
        )}
        <Menu.Item icon={<IconMaximize size={rem(14)} />}>Mở trang mới </Menu.Item>
        <Menu.Item icon={<IconExternalLink size={rem(14)} />}>Mở tab mới</Menu.Item>
        <Menu.Item icon={<IconFlag size={rem(14)} />} color='red'>
          Báo cáo
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
