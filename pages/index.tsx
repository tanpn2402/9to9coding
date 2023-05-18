import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import type { Category, Post, Tag, User } from '@prisma/client';
import Header from '@/components/Layout/Header';
import { classNames } from '@/utils';
import { format, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { BASE_POST_URL } from '@/utils/config';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';

const AllPostsQuery = gql`
  query queryPosts($first: Int, $after: ID) {
    posts(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          description
          createdAt
          modifiedAt
          slug
          author {
            id
            name
            email
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
    author: User;
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
  const theme = useMantineTheme();
  const { data, loading, error, fetchMore } = useQuery<TData>(AllPostsQuery, {
    variables: { first: 20 }
  });

  let main;
  if (loading) {
    main = <p>Loading...</p>;
  }
  // If error
  else if (error) {
    main = <p>Oh no... {error.message}</p>;
  }
  // If has data
  else {
    const { endCursor, hasNextPage } = data!.posts.pageInfo;
    const mainGridClasses = 'grid grid-cols-12 gap-2 items-center rounded-sm';

    main = (
      <>
        <div className={classNames(mainGridClasses, 'text-sm px-4 py-2')}>
          <div className='col-span-8'>Bài viết</div>
          <div className='col-span-2'>Chủ đề</div>
          <div className='col-span-2'>Thời gian</div>
        </div>

        {data?.posts?.edges?.map?.(({ node: post }, index) => (
          <div
            key={`User-#${post.id}`}
            className={classNames(mainGridClasses, 'text-sm p-4')}
            style={{
              background:
                index % 2 === 0
                  ? theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[1]
                  : theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.colors.gray[0]
            }}>
            <div className='col-span-8'>
              <div className='flex items-center w-full'>
                <div className='mr-2 rounded-full w-10 h-10 flex-center bg-green-500'>
                  {post.author.name.charAt(0)}
                </div>
                <div className='flex-1'>
                  <div className='font-normal mb-1 text-base'>
                    <Link href={`${BASE_POST_URL}/${post.slug}`} className='link-sm'>
                      {post.title}
                    </Link>
                  </div>
                  <div className='flex items-center'>
                    {post.tags.map(({ tag }) => (
                      <div
                        key={`Tag#${tag.id}`}
                        className='rounded-sm px-2 bg-gray-200 bg-gray-400 mr-2 text-xs text-white'>
                        {tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-span-2'>
              {post.categories.map(({ category }) => (
                <div
                  key={`Category#${category.id}`}
                  className={classNames(
                    'rounded-sm px-2 py-2 bg-gray-200 mr-2 text-xs w-fit text-white'
                  )}
                  style={{ backgroundColor: category.color! }}>
                  {category.name}
                </div>
              ))}
            </div>
            <div className='col-span-2'>
              {post.createdAt
                ? formatDistance(new Date(post.createdAt), new Date(), {
                    includeSeconds: true,
                    locale: vi
                  })
                : ''}
            </div>
          </div>
        ))}

        {hasNextPage ? (
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded my-10'
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.posts.edges = [
                    ...prevResult.posts.edges,
                    ...fetchMoreResult.posts.edges
                  ];
                  return fetchMoreResult;
                }
              });
            }}>
            more
          </button>
        ) : (
          <p className='my-10 text-center font-medium'>You{"'"}ve reached the end! </p>
        )}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>iamtan - personal blog</title>
        <meta name='description' content='IAMTAN' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='container mx-auto min-h-screen py-24 text-main'>{main}</main>
    </>
  );
}
