import Head from 'next/head';
import { forEach } from 'lodash';
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { IconError404, IconFlag2Filled } from '@tabler/icons-react';
import type { Category, Post, Profile, Tag, User } from '@prisma/client';
import { Button, Center, Flex, Group, Loader, Text } from '@mantine/core';
import Header from '@/components/Layout/Header';
import { LeftSideBar } from '@/components/Layout/LeftSidebar';
import { TweetCard } from '@/components/Layout/TweetCard';
import { RightSidebar } from '@/components/Layout/RightSidebar';
import { SkeletonLoading } from '@/components/runtime/SkeletonLoading';
import { TweetCardSkeleton } from '@/components/Layout/TweetCardSkeleton';

const AllPostsQuery = gql`
  query queryPosts($first: Int, $after: ID) {
    posts(first: $first, after: $after, orderBy: "createdAt:desc") {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
  posts: {
    pageInfo: {
      endCursor: any;
      hasNextPage: boolean;
    };
    edges: TNode[];
  };
};

export default function Home() {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data, loading, error, fetchMore } = useQuery<TData>(AllPostsQuery, {
    variables: { first: 10 }
  });

  let main;
  const tweets: JSX.Element[] = [];

  // If error
  if (error) {
    main = <p>Oh no... {error.message}</p>;
    tweets.push(
      <React.Fragment key={`Error`}>
        <IconError404 />
      </React.Fragment>
    );
  }
  // If has data
  else {
    forEach(data?.posts?.edges, el => {
      tweets.push(<TweetCard key={el.node.id} post={el.node} author={el.node.author} />);
    });

    if (data?.posts?.pageInfo?.hasNextPage) {
      if (isFetchingMore) {
        tweets.push(
          <Center key={`LoadingMoreContainer`} w='100%' mt='lg'>
            <Flex align='center' gap='sm'>
              <Loader size='sm' />
              <Text>Đang tải...</Text>
            </Flex>
          </Center>
        );
      } else {
        tweets.push(
          <Center key={`LoadMoreContainer`} w='100%' mt='lg'>
            <Button
              onClick={async () => {
                setIsFetchingMore(true);
                await fetchMore({
                  variables: { after: data?.posts?.pageInfo?.endCursor },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    fetchMoreResult.posts.edges = [
                      ...prevResult.posts.edges,
                      ...fetchMoreResult.posts.edges
                    ];
                    return fetchMoreResult;
                  }
                });
                setIsFetchingMore(false);
              }}>
              Tải thêm bài
            </Button>
          </Center>
        );
      }
    } else {
      tweets.push(
        <Center key={`EndOfPageContainer`} w='100%' mt='lg'>
          <Flex align='center' gap='sm'>
            <IconFlag2Filled />
            <Text>Hết bài rồi</Text>
          </Flex>
        </Center>
      );
    }
  }

  main = (
    <Flex align='start'>
      <LeftSideBar />
      <SkeletonLoading
        isLoading={loading}
        loadingContent={
          <Group className='flex-1 gap-8' px='xl' display='flex'>
            <TweetCardSkeleton />
          </Group>
        }
        loadedContent={
          <Group className='flex-1 gap-8 max-w-[768px]' px='xl' display='flex'>
            {tweets}
          </Group>
        }
      />
      <RightSidebar />
    </Flex>
  );

  return (
    <>
      <Head>
        <title>Gì đó - Trang này nói về cái gì đó</title>
        <meta name='description' content='Gì đó - Trang này nói về cái gì đó' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='container mx-auto min-h-screen py-24 text-main'>{main}</main>
    </>
  );
}
