import { Menu, ActionIcon, rem } from '@mantine/core';
import { IconDots, IconExternalLink, IconFlag, IconMaximize } from '@tabler/icons-react';

export const TweetCardMenu: React.FC<unknown> = () => {
  return (
    <Menu withinPortal position='bottom-end' shadow='sm'>
      <Menu.Target>
        <ActionIcon>
          <IconDots size='1rem' />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconMaximize size={rem(14)} />}>Mở trang mới </Menu.Item>
        <Menu.Item icon={<IconExternalLink size={rem(14)} />}>Mở tab mới</Menu.Item>
        <Menu.Item icon={<IconFlag size={rem(14)} />} color='red'>
          Báo cáo
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};