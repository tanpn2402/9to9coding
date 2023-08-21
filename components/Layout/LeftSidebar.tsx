import { Avatar, Badge, Box, NavLink, Space, Text } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconChevronRight,
  IconActivity,
  IconCircleOff,
  IconTag,
  IconHash
} from '@tabler/icons-react';

const NavGroup = () => (
  <>
    <Text weight={500} size='lg'>
      Gì đó
    </Text>
    <NavLink label='Trang chủ' icon={<IconHome2 size='1.5rem' stroke={1} />} />
    <NavLink label='Trang gì đó' icon={<IconGauge size='1.5rem' stroke={1} />} />
    <NavLink label='Trang bị disabled' icon={<IconCircleOff size='1.5rem' stroke={1} />} disabled />
    <NavLink
      label='Trang này có chỉ mục'
      description='Thông tin thêm nè'
      icon={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          3
        </Badge>
      }
    />
  </>
);

const TagGroup = () => (
  <>
    <Text weight={500} size='lg'>
      Top tags
    </Text>
    <NavLink
      label='Tag 1'
      icon={<IconHash size='1.5rem' stroke={1} />}
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          32
        </Badge>
      }
      w={260}
    />
    <NavLink
      label='Tag 2'
      icon={<IconHash size='1.5rem' stroke={1} />}
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          12
        </Badge>
      }
      w={260}
    />
    <NavLink
      label='Tag 3'
      icon={<IconHash size='1.5rem' stroke={1} />}
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          16
        </Badge>
      }
      w={260}
    />
    <NavLink
      label='Tag 4'
      icon={<IconHash size='1.5rem' stroke={1} />}
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          3
        </Badge>
      }
      w={260}
    />
  </>
);

const UserGroup = () => (
  <>
    <Text weight={500} size='lg'>
      Top guys
    </Text>
    <NavLink
      label='Guy 1'
      icon={
        <Avatar color='cyan' radius='xl' size={32}>
          MK
        </Avatar>
      }
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          3
        </Badge>
      }
      w={260}
    />
    <NavLink
      label='Guy 2'
      icon={
        <Avatar color='cyan' radius='xl' size={32}>
          MK
        </Avatar>
      }
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          13
        </Badge>
      }
      w={260}
    />
    <NavLink
      label='Guy 1'
      icon={
        <Avatar color='cyan' radius='xl' size={32}>
          MK
        </Avatar>
      }
      rightSection={
        <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
          3
        </Badge>
      }
      w={260}
    />
  </>
);

export function LeftSideBar() {
  return (
    <Box w={320} pr={40}>
      <NavGroup />
      <Space h='xl' />
      <TagGroup />
      <Space h='xl' />
      <UserGroup />
    </Box>
  );
}
