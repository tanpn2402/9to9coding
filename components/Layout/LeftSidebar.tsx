import { gql, useQuery } from '@apollo/client';
import { Badge, Box, ColorSwatch, Flex, NavLink, Skeleton, Space, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { Category, Tag, User } from '@prisma/client';
import {
  IconHome2,
  IconGauge,
  IconCircleOff,
  IconHash,
  IconUser,
  IconSettings,
  IconLogout,
  IconUserPlus
} from '@tabler/icons-react';
import Sticky from 'react-stickynode';
import { SkeletonLoading } from '../runtime/SkeletonLoading';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useIdentity } from '@/utils/hooks/useIdentity';
import { isNil } from 'lodash';
import { Avatar } from '../runtime/Avatar';

const LeftSideBarGeneralDataQuery = gql`
  query {
    categories {
      edges {
        category: node {
          id
          name
          slug
          color
          posts {
            totalCount
          }
        }
      }
    }
    tags {
      edges {
        tag: node {
          id
          name
          posts {
            totalCount
          }
        }
      }
    }
    users {
      edges {
        user: node {
          id
          name
          email
          posts {
            totalCount
          }
        }
      }
    }
  }
`;

type WithPostTotalCount<T> = T & {
  posts: {
    totalCount: number;
  };
};

type TData = {
  categories: {
    edges: Array<{ category: WithPostTotalCount<Category> }>;
  };
  tags: {
    edges: Array<{ tag: WithPostTotalCount<Tag> }>;
  };
  users: {
    edges: Array<{ user: WithPostTotalCount<User> }>;
  };
};

const NavGroup = () => {
  const router = useRouter();
  const user = useIdentity();

  return (
    <>
      <Text weight={500} size='lg'>
        Gì đó
      </Text>
      {isNil(user) ? (
        <>
          <NavLink
            label={
              <Box>
                <Flex align='center' gap='sm'>
                  <Avatar color='cyan' radius='xl' size={40}>
                    <IconUser size='1.5rem' stroke={1} />
                  </Avatar>
                  <Text>Đăng nhập</Text>
                </Flex>
              </Box>
            }
            onClick={() => {
              router.push('/auth/signin');
            }}
          />
          <NavLink
            label={
              <Box>
                <Flex align='center' gap='sm'>
                  <Avatar color='cyan' radius='xl' size={40}>
                    <IconUserPlus size='1.5rem' stroke={1} />
                  </Avatar>
                  <Text>Đăng kí</Text>
                </Flex>
              </Box>
            }
            onClick={() => {
              router.push('/auth/signup');
            }}
          />
        </>
      ) : (
        <NavLink
          label={
            <Box>
              <Flex align='center' gap='sm'>
                <Avatar color='cyan' radius='xl' size={40}>
                  {user.name}
                </Avatar>
                <Text>{user.name}</Text>
              </Flex>
            </Box>
          }>
          <NavLink label='Thông tin' icon={<IconUser size='1.5rem' stroke={1} />} />
          <NavLink label='Cài đặt gì đó' icon={<IconSettings size='1.5rem' stroke={1} />} />
          <NavLink
            color='danger'
            label='Đăng xuất'
            icon={<IconLogout size='1.5rem' stroke={1} />}
          />
        </NavLink>
      )}

      <NavLink label='Trang này về nhà' icon={<IconHome2 size='1.5rem' stroke={1} />} />
      <NavLink label='Trang nói về chủ đề' icon={<IconGauge size='1.5rem' stroke={1} />} />
      <NavLink
        label='Viết bài ở đây'
        disabled={isNil(user)}
        description={isNil(user) ? 'Cần phải đăng nhập vào được nha' : undefined}
        icon={<IconSquareRoundedPlus size='1.5rem' stroke={1} />}
        onClick={() => {
          router.push('/p/new');
        }}
      />
      <NavLink
        label='Trang này bị disabled'
        description='Chỉ có VIP mới vào được'
        icon={<IconCircleOff size='1.5rem' stroke={1} />}
        disabled
      />
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
};

const TopCategories: React.FC<{ categories: TData['categories']['edges']; loading: boolean }> = ({
  categories,
  loading
}) => (
  <>
    <Text weight={500} size='lg'>
      Top categories
    </Text>
    <SkeletonLoading
      isLoading={loading}
      loadingContent={
        <Flex direction='column' gap='xs'>
          <Skeleton width={180} height={28} />
          <Skeleton width={180} height={28} />
        </Flex>
      }
      loadedContent={
        <>
          {categories.map(({ category }) => (
            <NavLink
              key={category.id}
              label={category.name}
              icon={<ColorSwatch w={20} h={20} color={category.color ?? 'gray'} />}
              rightSection={
                <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
                  {category.posts.totalCount}
                </Badge>
              }
              w={260}
            />
          ))}
        </>
      }
    />
  </>
);

const TopTags: React.FC<{ tags: TData['tags']['edges']; loading: boolean }> = ({
  tags,
  loading
}) => (
  <>
    <Text weight={500} size='lg'>
      Top tags
    </Text>
    <SkeletonLoading
      isLoading={loading}
      loadingContent={
        <Flex direction='column' gap='xs'>
          <Skeleton width={180} height={28} />
          <Skeleton width={180} height={28} />
        </Flex>
      }
      loadedContent={
        <>
          {tags.map(({ tag }) => (
            <NavLink
              key={tag.id}
              label={tag.name}
              icon={<IconHash size='1.5rem' stroke={1} />}
              rightSection={
                <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
                  {tag.posts.totalCount}
                </Badge>
              }
              w={260}
            />
          ))}
        </>
      }
    />
  </>
);

const TopUsers: React.FC<{ users: TData['users']['edges']; loading: boolean }> = ({
  users,
  loading
}) => (
  <>
    <Text weight={500} size='lg'>
      Top guys
    </Text>
    <SkeletonLoading
      isLoading={loading}
      loadingContent={
        <Flex direction='column' gap='xs'>
          <Skeleton width={180} height={28} />
          <Skeleton width={180} height={28} />
        </Flex>
      }
      loadedContent={
        <>
          {users.map(({ user }) => (
            <NavLink
              key={user.id}
              label={user.email}
              icon={
                <Avatar color='cyan' radius='xl' size={28}>
                  {user.name}
                </Avatar>
              }
              rightSection={
                <Badge size='sm' variant='filled' color='green' w={22} h={22} p={0}>
                  {user.posts.totalCount}
                </Badge>
              }
              w={260}
            />
          ))}
        </>
      }
    />
  </>
);

export function LeftSideBar() {
  const { data, loading } = useQuery<TData>(LeftSideBarGeneralDataQuery);
  return (
    <Box w={320} pr={40}>
      <Sticky enabled={true} top={100}>
        <NavGroup />
        <Space h='xl' />
        <TopCategories categories={data?.categories?.edges ?? []} loading={loading} />
        <Space h='xl' />
        <TopTags tags={data?.tags?.edges ?? []} loading={loading} />
        <Space h='xl' />
        <TopUsers users={data?.users?.edges ?? []} loading={loading} />
      </Sticky>
    </Box>
  );
}
