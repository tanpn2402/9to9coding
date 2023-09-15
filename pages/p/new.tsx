import dynamic from 'next/dynamic';
import { lowlight } from 'lowlight';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import javaLanguageSyntax from 'highlight.js/lib/languages/java';
import jsLanguageSyntax from 'highlight.js/lib/languages/javascript';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import {
  Button,
  Card,
  Collapse,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  MultiSelect,
  Text,
  rem
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { gql, useQuery, useMutation, FetchResult } from '@apollo/client';
import { Category, Tag } from '@prisma/client';
import { UseFormReturnType, useForm } from '@mantine/form';
import { useModal } from '@/utils/hooks/useModal';
import { PostTypes } from '@/utils/types/PostTypes';
import { isNil, map } from 'lodash';
import Sticky from 'react-stickynode';
import { LinkBubbleMenu } from '@/components/Editor/bubble-menus/LinkBubbleMenu';
import { PhotoBubbleMenu } from '@/components/Editor/bubble-menus/PhotoBubbleMenu';
import { useTextEditor } from '@/components/Editor/useTextEditor';

const TextEditor = dynamic(() => import('@/components/Editor/Editor'), {
  loading: () => <LoadingOverlay visible />
});

// register languages that your are planning to use
lowlight.registerLanguage('ts', tsLanguageSyntax);
lowlight.registerLanguage('java', javaLanguageSyntax);
lowlight.registerLanguage('js', jsLanguageSyntax);

const CategoryAndTagQuery = gql`
  query {
    categories {
      totalCount
      edges {
        node {
          id
          name
          color
          posts {
            totalCount
          }
        }
      }
    }
    tags {
      totalCount
      edges {
        node {
          id
          name
          posts {
            totalCount
          }
        }
      }
    }
  }
`;

const NewPostMutation = gql`
  mutation NewPost($title: String!, $content: String!, $categories: [String!], $tags: [String!]) {
    result: createPost(content: $content, title: $title, categories: $categories, tags: $tags) {
      id
      slug
    }
  }
`;

const UpdatePostMutation = gql`
  mutation UpdatePost(
    $id: String!
    $title: String!
    $content: String!
    $categories: [String!]
    $tags: [String!]
  ) {
    result: updatePost(
      id: $id
      content: $content
      title: $title
      categories: $categories
      tags: $tags
    ) {
      id
      slug
    }
  }
`;

type MutationResult = {
  result: {
    id?: string;
    slug?: string;
  };
};

type TCategoryNode = {
  node: Category & {
    posts: {
      totalCount: number;
    };
  };
};

type TTagNode = {
  node: Tag & {
    posts: {
      totalCount: number;
    };
  };
};

type TData = {
  categories: {
    totalCount: number;
    edges: TCategoryNode[];
  };
  tags: {
    totalCount: number;
    edges: TTagNode[];
  };
};

type Option = {
  label: string;
  value: string;
};

const useOptions = (form: UseFormReturnType<NewPostForm>) => {
  const { data, loading } = useQuery<TData>(CategoryAndTagQuery);
  const [tagOptions, setTagOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  useEffect(() => {
    setTagOptions(
      data?.tags.edges.map(c => ({
        value: c.node.id,
        label: c.node.name
      })) ?? []
    );
    setCategoryOptions(
      data?.categories.edges.map(c => ({
        value: c.node.id,
        label: c.node.name
      })) ?? []
    );
  }, [data]);

  return {
    loading,
    tagOptions,
    tagSelected: form.values.tags,
    categoryOptions,
    categorySelected: form.values.categories,
    setCategoryOptions,
    setCategorySelected: (categories: string[]) => form.setValues({ categories }),
    setTagOptions,
    setTagSelected: (tags: string[]) => form.setValues({ tags })
  };
};

type PageProps = {
  post?: PostTypes;
};

type NewPostForm = {
  title: string;
  categories?: string[];
  tags?: string[];
  content?: string;
};

const PostEditorPage: React.FC<PageProps> = ({ post }) => {
  const isCreateNewMode = useMemo(() => isNil(post), [post]);
  const [opened, { toggle }] = useDisclosure(isCreateNewMode ? false : true);
  const [createPost, { loading: isSubmittingCreate }] =
    useMutation<MutationResult>(NewPostMutation);
  const [updatePost, { loading: isSubmittingUpdate }] =
    useMutation<MutationResult>(UpdatePostMutation);
  const [postSlug, setPostSlug] = useState(post?.slug);
  const router = useRouter();
  const editor = useTextEditor({
    content: post?.content
  });

  const form = useForm<NewPostForm>({
    initialValues: {
      title: post?.title ?? 'Tiêu đề',
      categories: map(post?.categories, el => el.categoryId),
      tags: map(post?.tags, el => el.tagId)
    },
    validate: {
      title: value => (String(value).length > 6 ? null : 'Hãy nhập một tiêu đề thật ý nghĩa')
    }
  });

  const {
    loading,
    tagOptions,
    tagSelected,
    categoryOptions,
    categorySelected,
    setCategoryOptions,
    setCategorySelected,
    setTagOptions,
    setTagSelected
  } = useOptions(form);

  const modalWarningEmptyCategory = useModal({
    title: 'cảnh báo',
    childrenFn({ triggerClose }) {
      return (
        <div>
          <Text fz='md'>có chắc là không cần gắn vào Chủ đề nào hả?</Text>
          <Group grow position='center' mt='xl'>
            <Button variant='subtle' onClick={triggerClose}>
              khoan để thêm
            </Button>
            <Button
              variant='light'
              onClick={() => {
                form.onSubmit(hanleSubmit({ ignoreEmptyCategory: true }))();
                triggerClose();
              }}>
              thôi không cần
            </Button>
          </Group>
        </div>
      );
    }
  });

  const modalWarningEmptyContent = useModal({
    title: 'cảnh báo',
    childrenFn({ triggerClose }) {
      return (
        <div>
          <Text fz='md'>hừmmm có vẻ như là nôi dung hơi ít</Text>
          <Group position='center' mt='xl'>
            <Button variant='light' onClick={triggerClose}>
              okay để viết thêm
            </Button>
          </Group>
        </div>
      );
    }
  });

  const modalNotifySuccess = useModal({
    title: 'thông báo',
    childrenFn({ triggerClose }) {
      return (
        <div>
          <Text fz='md'>thành công rồi nha</Text>
          <Group position='center' mt='xl'>
            <Button variant='subtle' onClick={triggerClose}>
              đã hiểu
            </Button>
            <Button
              variant='light'
              onClick={() => {
                router.push('/p/' + postSlug);
              }}>
              xem bài
            </Button>
          </Group>
        </div>
      );
    }
  });

  const hanleSubmit =
    ({ ignoreEmptyCategory }: { ignoreEmptyCategory: boolean }) =>
    async ({ title, categories, tags }: NewPostForm) => {
      if (!ignoreEmptyCategory && (categories?.length ?? 0) < 1) {
        modalWarningEmptyCategory.triggerOpen();
      } else if ((editor?.getText().length ?? 0) < 69) {
        modalWarningEmptyContent.triggerOpen();
      } else {
        let resp: FetchResult<MutationResult>;
        if (isCreateNewMode) {
          resp = await createPost({
            variables: {
              title: title,
              categories: categories,
              tags: tags,
              content: editor?.getHTML()
            }
          });
        } else {
          resp = await updatePost({
            variables: {
              id: post?.id,
              title: title,
              categories: categories,
              tags: tags,
              content: editor?.getHTML()
            }
          });
        }

        if (resp.data?.result.id) {
          // Success
          setPostSlug(resp.data?.result.slug);
          modalNotifySuccess.triggerOpen();
        } else if (resp.errors) {
          // error
        }
      }
    };

  return (
    <main className='container mx-auto max-w-[1024px] min-h-screen pt-4 pb-32 text-main'>
      <form onSubmit={form.onSubmit(hanleSubmit({ ignoreEmptyCategory: false }))}>
        <Input
          multiline
          size='xl'
          placeholder='Tiêu đề'
          mt={rem(32)}
          mb={rem(42)}
          fs={rem(32)}
          variant='unstyled'
          {...form.getInputProps('title')}
          disabled={isSubmittingCreate || isSubmittingUpdate}
          styles={_theme => ({
            input: {
              fontSize: rem(32)
            }
          })}
        />

        <div className='flex'>
          <TextEditor editor={editor} />
          <div className='pl-4 w-[256px]'>
            <Sticky enabled={true} top={50}>
              <Card shadow='xs' padding='lg' radius='xs'>
                <Group mb={5}>
                  <Button
                    variant='subtle'
                    size='xs'
                    px={rem(2)}
                    mx={-rem(2)}
                    rightIcon={
                      opened ? <IconChevronUp size={rem(14)} /> : <IconChevronDown size={rem(14)} />
                    }
                    onClick={toggle}>
                    Thêm thông tin
                  </Button>
                </Group>

                <Collapse in={opened}>
                  <MultiSelect
                    mb={rem(16)}
                    label='Chủ đề'
                    data={categoryOptions ?? []}
                    size='sm'
                    placeholder='Chọn chủ đề'
                    searchable
                    creatable
                    disabled={loading || isSubmittingCreate || isSubmittingUpdate}
                    icon={loading ? <Loader size={rem(16)} /> : undefined}
                    getCreateLabel={query => `+ ${query}`}
                    value={categorySelected}
                    onChange={setCategorySelected}
                    onCreate={query => {
                      const item = { value: query, label: query };
                      setCategorySelected([...(categorySelected ?? []), query]);
                      setCategoryOptions(current => [...current, item]);
                      return item;
                    }}
                  />
                  <MultiSelect
                    mb={rem(16)}
                    label='Tags'
                    data={tagOptions ?? []}
                    size='sm'
                    placeholder='Chọn thẻ tags'
                    searchable
                    creatable
                    disabled={loading || isSubmittingCreate || isSubmittingUpdate}
                    icon={loading ? <Loader size={rem(16)} /> : undefined}
                    getCreateLabel={query => `+ ${query}`}
                    value={tagSelected}
                    onChange={setTagSelected}
                    onCreate={query => {
                      const item = { value: query, label: query };
                      setTagSelected([...(tagSelected ?? []), query]);
                      setTagOptions(current => [...current, item]);
                      return item;
                    }}
                  />
                </Collapse>

                <Button
                  mt={rem(48)}
                  fullWidth
                  variant='filled'
                  type='submit'
                  loading={isSubmittingCreate || isSubmittingUpdate}
                  disabled={isSubmittingCreate || isSubmittingUpdate}>
                  {isCreateNewMode ? 'Đăng bài' : 'Cập nhật'}
                </Button>
              </Card>
            </Sticky>
          </div>
        </div>
      </form>

      {modalWarningEmptyCategory.modal}
      {modalWarningEmptyContent.modal}
      {modalNotifySuccess.modal}

      {editor && (
        <>
          <PhotoBubbleMenu editor={editor} />
          <LinkBubbleMenu editor={editor} />
        </>
      )}
    </main>
  );
};

export default PostEditorPage;
