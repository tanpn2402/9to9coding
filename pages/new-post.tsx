import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { lowlight } from 'lowlight';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import {
  Affix,
  Button,
  Card,
  Collapse,
  Group,
  Input,
  Loader,
  MultiSelect,
  Text,
  rem
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { InsertPhotoControl } from '@/components/Editor/InsertPhotoControl';
import { UploadPhotoControl } from '@/components/Editor/UploadPhotoControl';
import { TableControls } from '@/components/Editor/TableControls';
import { gql, useQuery, useMutation, FetchResult } from '@apollo/client';
import { Category, Tag } from '@prisma/client';
import { UseFormReturnType, useForm } from '@mantine/form';
import { useModal } from '@/utils/hooks/useModal';
import { PostTypes } from '@/utils/types/PostTypes';
import { isNil, map } from 'lodash';
import Sticky from 'react-stickynode';

// register languages that your are planning to use
lowlight.registerLanguage('ts', tsLanguageSyntax);

const ButtonStyles = { width: 38, height: 34 };

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
            <Button variant='light' onClick={triggerClose}>
              đã hiểu
            </Button>
          </Group>
        </div>
      );
    }
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image.configure({
        HTMLAttributes: {
          alt: ''
        }
      }),
      Dropcursor,
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({
        lowlight
      })
    ],
    content: post?.content ?? `<p>Bắt đầu viết những thứ hay ho...</p><p></p>`
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
          <RichTextEditor editor={editor} className='max-w-[768px]'>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 sx={ButtonStyles} />
                <RichTextEditor.H2 sx={ButtonStyles} />
                <RichTextEditor.H3 sx={ButtonStyles} />
                <RichTextEditor.H4 sx={ButtonStyles} />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold sx={ButtonStyles} />
                <RichTextEditor.Italic sx={ButtonStyles} />
                <RichTextEditor.Underline sx={ButtonStyles} />
                <RichTextEditor.Strikethrough sx={ButtonStyles} />
                <RichTextEditor.ClearFormatting sx={ButtonStyles} />
                <RichTextEditor.Highlight sx={ButtonStyles} />
                <RichTextEditor.Code sx={ButtonStyles} />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote sx={ButtonStyles} />
                <RichTextEditor.Hr sx={ButtonStyles} />
                <RichTextEditor.BulletList sx={ButtonStyles} />
                <RichTextEditor.OrderedList sx={ButtonStyles} />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.CodeBlock sx={ButtonStyles} />
                <InsertPhotoControl />
                <UploadPhotoControl />
              </RichTextEditor.ControlsGroup>

              <TableControls
                isDeleteColumnEnable={editor?.can().deleteColumn()}
                isInsertColumnEnable={editor?.can().addColumnAfter()}
                isDeleteRowEnable={editor?.can().deleteRow()}
                isInsertRowEnable={editor?.can().addRowAfter()}
                isMergeOrSplitEnable={editor?.can().mergeOrSplit()}
              />

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link sx={ButtonStyles} />
                <RichTextEditor.Unlink sx={ButtonStyles} />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft sx={ButtonStyles} />
                <RichTextEditor.AlignCenter sx={ButtonStyles} />
                <RichTextEditor.AlignJustify sx={ButtonStyles} />
                <RichTextEditor.AlignRight sx={ButtonStyles} />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
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

        {/* <Affix position={{ bottom: 0, left: 0 }} w='100%'>
          <div className='container mx-auto pt-4 pb-16 flex justify-end'>
            
          </div>
        </Affix> */}
      </form>
      {/* Modal */}
      {modalWarningEmptyCategory.modal}
      {modalWarningEmptyContent.modal}
      {modalNotifySuccess.modal}
    </main>
  );
};

export default PostEditorPage;
