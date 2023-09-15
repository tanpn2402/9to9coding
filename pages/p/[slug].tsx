import Head from 'next/head';
import Header from '@/components/Layout/Header';
import { GetServerSideProps } from 'next';
import { isEmpty, isNil, map } from 'lodash';
import { Space, Text, Title, TypographyStylesProvider } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { Affix, Button, Transition, rem } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import prisma from '@/lib/prisma';
import Sticky from 'react-stickynode';
import { AuthorInfo } from '@/components/Layout/AuthorInfo';
import { PostMetadata } from '@/components/Layout/PostMetadata';
import { format } from 'date-fns';
import { PostTypes } from '@/utils/types/PostTypes';

type Props = {
  post: PostTypes;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const slug = String(ctx.params?.['slug']);
  if (isEmpty(slug)) {
    return {
      props: {},
      notFound: true
    };
  }
  const post = await prisma.post.findFirst({
    where: {
      slug: {
        equals: String(ctx.params?.['slug'])
      }
    },
    select: {
      title: true,
      author: {
        include: {
          profile: true
        }
      },
      slug: true,
      categories: {
        include: {
          category: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      },
      comments: true,
      id: true,
      content: true,
      description: true,
      createdAt: true,
      modifiedAt: true
    }
  });
  if (isNil(post)) {
    return {
      props: {},
      notFound: true
    };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post))
    }
  };
};

export default function Home({ post }: Props) {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <>
      <Head>
        <title>iamtan - {post.title}</title>
        <meta name='description' content={post.title} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header fixed={false} />
      <main className='container mx-auto max-w-[1024px] min-h-screen pb-24'>
        <Title order={1} my={rem(16)}>
          {post.title}
        </Title>
        <Text size='sm' color='dimmed' my={rem(16)}>
          {format(new Date(String(post.createdAt)), 'dd/MM/yyyy HH:mm:sss')}
        </Text>

        <div className='flex'>
          <TypographyStylesProvider className='max-w-[768px]'>
            <div className='post-content' dangerouslySetInnerHTML={{ __html: post.content }} />
          </TypographyStylesProvider>

          <div className='pl-8 w-[256px]'>
            <Space h='xs' />
            <AuthorInfo {...post.author} postId={post.id} />
            <Space h='xl' />
            <Sticky enabled={true} top={50}>
              <PostMetadata
                categories={map(post.categories, el => el.category)}
                tags={map(post.tags, el => el.tag)}
              />
            </Sticky>
          </div>
        </div>
      </main>
      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Transition transition='slide-up' mounted={scroll.y > 0}>
          {transitionStyles => (
            <Button
              variant='light'
              leftIcon={<IconArrowUp size={rem(16)} />}
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}>
              lên đỉnh
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
}
