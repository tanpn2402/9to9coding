import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { gql, useQuery } from '@apollo/client';
import type { User } from '@prisma/client';
import Header from '@/components/Layout/Header';

const AllUsersQuery = gql`
  query queryUsers($first: Int, $after: ID) {
    users(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          email
        }
      }
    }
  }
`;

const inter = Inter({ subsets: ['latin'] });

type TNode = {
  node: User;
};

type TData = {
  users: {
    pageInfo: {
      endCursor: any;
      hasNextPage: boolean;
    };
    edges: TNode[];
  };
};

export default function Home() {
  const { data, loading, error, fetchMore } = useQuery<TData>(AllUsersQuery, {
    variables: { first: 1 }
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
    const { endCursor, hasNextPage } = data!.users.pageInfo;
    main = (
      <>
        <div className={styles.grid}>
          {data?.users?.edges?.map?.(({ node: user }) => (
            <a key={`User-#${user.id}`} href='#' className={styles.card}>
              <h2 className={inter.className}>{user.name}</h2>
              <p className={inter.className}>{user.email}</p>
            </a>
          ))}
        </div>
        {hasNextPage ? (
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded my-10'
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.users.edges = [
                    ...prevResult.users.edges,
                    ...fetchMoreResult.users.edges
                  ];
                  return fetchMoreResult;
                }
              });
            }}>
            more
          </button>
        ) : (
          <p className='my-10 text-center font-medium'>You've reached the end! </p>
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
      <main className='container mx-auto min-h-screen py-24'>{main}</main>
    </>
  );
}
