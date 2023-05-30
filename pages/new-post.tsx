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
  Collapse,
  Group,
  Input,
  Loader,
  MultiSelect,
  Text,
  rem
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { InsertPhotoControl } from '@/components/Editor/InsertPhotoControl';
import { UploadPhotoControl } from '@/components/Editor/UploadPhotoControl';
import { TableControls } from '@/components/Editor/TableControls';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Category, Tag } from '@prisma/client';
import { UseFormReturnType, useForm } from '@mantine/form';
import { useModal } from '@/utils/hooks/useModal';

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
    createPost(content: $content, title: $title, categories: $categories, tags: $tags) {
      id
      slug
    }
  }
`;

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

type NewPostForm = {
  title: string;
  categories?: string[];
  tags?: string[];
  content?: string;
};

export default function Demo() {
  const [createPost, { loading: isSubmitting }] = useMutation<{ id: string }>(NewPostMutation);

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
              variant='outline'
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
            <Button variant='outline' onClick={triggerClose}>
              okay để viết thêm
            </Button>
          </Group>
        </div>
      );
    }
  });

  const form = useForm<NewPostForm>({
    initialValues: {
      title: 'Tiêu đề'
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
    content: `<p>Bắt đầu viết những thứ hay ho...</p><p></p>`
  });
  const [opened, { toggle }] = useDisclosure(false);
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
        let resp = await createPost({
          variables: {
            title: title,
            categories: categories,
            tags: tags,
            content: editor?.getHTML()
          }
        });

        if (resp.data?.id) {
          // Success
        } else if (resp.errors) {
          // error
        }
      }
    };

  return (
    <main className='container mx-auto min-h-screen pt-4 pb-32 text-main'>
      <form id='newPostForm' onSubmit={form.onSubmit(hanleSubmit({ ignoreEmptyCategory: false }))}>
        <Input
          multiline
          size='xl'
          placeholder='Tiêu đề'
          mb={rem(4)}
          fs={rem(32)}
          variant='unstyled'
          {...form.getInputProps('title')}
          disabled={isSubmitting}
          styles={_theme => ({
            input: {
              fontSize: rem(32)
            }
          })}
        />

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
            size='xs'
            placeholder='Chọn chủ đề'
            searchable
            creatable
            disabled={loading || isSubmitting}
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
            size='xs'
            placeholder='Chọn thẻ tags'
            searchable
            creatable
            disabled={loading || isSubmitting}
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

        <RichTextEditor editor={editor}>
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

        <Affix position={{ bottom: 0, left: 0 }} w='100%'>
          <div className='container mx-auto pt-4 pb-16 flex justify-end'>
            <Button form='newPostForm' type='submit' disabled={isSubmitting}>
              Đăng bài
            </Button>
          </div>
        </Affix>
      </form>
      {/* Modal */}
      {modalWarningEmptyCategory.modal}
      {modalWarningEmptyContent.modal}
    </main>
  );
}
