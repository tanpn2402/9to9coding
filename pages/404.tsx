import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import type { Category, Post, Tag, User } from '@prisma/client';
import Header from '@/components/Layout/Header';
import { classNames } from '@/utils';
import { format, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { BASE_POST_URL } from '@/utils/config';

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
  return (
    <>
      <Head>
        <title>iamtan - personal blog</title>
        <meta name='description' content='IAMTAN' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='container mx-auto min-h-screen py-24 text-main text-center'>
        <h1 className='text-2xl'>404</h1>
      </main>
    </>
  );
}
