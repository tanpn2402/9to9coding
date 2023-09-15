import prisma from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import PostEditorPage from './new';
import { isEmpty, isNil } from 'lodash';
import { PostTypes } from '@/utils/types/PostTypes';

type Props = {
  post: PostTypes;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const postId = String(ctx.query?.['id']);

  if (isEmpty(postId)) {
    return {
      props: {},
      notFound: true
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    select: {
      id: true,
      title: true,
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
      content: true
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

const EditPostPage: React.FC<Props> = ({ post }) => {
  return <PostEditorPage post={post} />;
};

export default EditPostPage;
