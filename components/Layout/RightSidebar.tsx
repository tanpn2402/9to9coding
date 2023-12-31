import React from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Box, Card, Flex, Group, NavLink, Skeleton, Space, Text, rem } from '@mantine/core';
import { Category, Post, Profile, Tag, User } from '@prisma/client';
import { SkeletonLoading } from '../runtime/SkeletonLoading';
import { GraphQLPageInfo } from '@/utils/types/GraphQLPageInfo';
import { Avatar } from '../runtime/Avatar';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';

const AllPostsQuery = gql`
  query queryPosts($first: Int) {
    newestPosts: posts(first: $first, orderBy: "createdAt:desc") {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...PostFragment
        }
      }
    }
    oldestPosts: posts(first: $first, orderBy: "createdAt:asc") {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...PostFragment
        }
      }
    }
  }

  fragment PostFragment on Post {
    id
    title
    content
    description
    createdAt
    modifiedAt
    slug
    author {
      id
      name
      email
      profile {
        bio
        picture
      }
    }
    categories {
      category {
        id
        name
        slug
        color
      }
    }
    tags {
      tag {
        id
        name
      }
    }
  }
`;

type TNode = {
  node: Post & {
    categories: [{ category: Category }];
    tags: [{ tag: Tag }];
    author: User & {
      profile: Profile;
    };
  };
};

type TData = {
  newestPosts: {
    pageInfo: GraphQLPageInfo;
    edges: TNode[];
  };
  oldestPosts: {
    pageInfo: GraphQLPageInfo;
    edges: TNode[];
  };
};

const NewestThings: React.FC<{ posts: TNode[]; loading: boolean }> = ({ posts, loading }) => {
  const router = useRouter();
  return (
    <Card>
      <Text weight={500} size='lg'>
        Gì đó mới
      </Text>
      <SkeletonLoading
        isLoading={loading}
        loadingContent={
          <Group>
            <Skeleton w='100%' height={30} />
            <Flex gap='xs' align='center'>
              <Group>
                <Skeleton width={28} height={28} circle />
              </Group>
              <Group display='block'>
                <Skeleton w={120} height={24} />
              </Group>
            </Flex>
          </Group>
        }
        loadedContent={
          <Flex direction='column' gap='md'>
            {posts.map(({ node: post }) => (
              <NavLink
                key={post.id}
                label={post.title}
                description={
                  <Link href={'/p/' + post.slug}>
                    <Flex gap='xs' align='center' mt={rem(4)}>
                      <Group>
                        <Avatar color='cyan' radius='xl' size={32}>
                          {post.author.name}
                        </Avatar>
                      </Group>
                      <Group display='block'>
                        <Text weight={500}>{post.author.email}</Text>
                        <Text weight={500} italic size={rem(10)}>
                          {post.createdAt
                            ? formatDistance(new Date(post.createdAt), new Date(), {
                                includeSeconds: true,
                                locale: vi
                              })
                            : ''}
                        </Text>
                      </Group>
                    </Flex>
                  </Link>
                }
              />
            ))}
          </Flex>
        }
      />
    </Card>
  );
};

const OldestThings: React.FC<{ posts: TNode[]; loading: boolean }> = ({ posts, loading }) => {
  const router = useRouter();

  return (
    <Card>
      <Text weight={500} size='lg'>
        Gì đó cũ hơn
      </Text>
      <SkeletonLoading
        isLoading={loading}
        loadingContent={
          <Group>
            <Skeleton w='100%' height={30} />
            <Flex gap='xs' align='center'>
              <Group>
                <Skeleton width={28} height={28} circle />
              </Group>
              <Group display='block'>
                <Skeleton w={120} height={24} />
              </Group>
            </Flex>
          </Group>
        }
        loadedContent={
          <Flex direction='column' gap='md'>
            {posts.map(({ node: post }) => (
              <NavLink
                key={post.id}
                label={post.title}
                description={
                  <Link href={'/p/' + post.slug}>
                    <Flex gap='xs' align='center' mt={rem(4)}>
                      <Group>
                        <Avatar color='cyan' radius='xl' size={32}>
                          {post.author.name}
                        </Avatar>
                      </Group>
                      <Group display='block'>
                        <Text weight={500}>{post.author.email}</Text>
                        <Text weight={500} italic size={rem(10)}>
                          {post.createdAt
                            ? formatDistance(new Date(post.createdAt), new Date(), {
                                includeSeconds: true,
                                locale: vi
                              })
                            : ''}
                        </Text>
                      </Group>
                    </Flex>
                  </Link>
                }
              />
            ))}
          </Flex>
        }
      />
    </Card>
  );
};

export function RightSidebar() {
  const { data, loading } = useQuery<TData>(AllPostsQuery, {
    variables: { first: 2 }
  });

  return (
    <Box w={320} pl={40}>
      <NewestThings posts={data?.newestPosts.edges ?? []} loading={loading} />
      <Space h='xl' />
      <OldestThings posts={data?.oldestPosts.edges ?? []} loading={loading} />
      <Space h='xl' />
    </Box>
  );
}
