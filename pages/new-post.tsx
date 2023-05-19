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
import { Affix, Button, Collapse, Group, Input, Loader, MultiSelect, rem } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { InsertPhotoControl } from '@/components/Editor/InsertPhotoControl';
import { UploadPhotoControl } from '@/components/Editor/UploadPhotoControl';
import { TableControls } from '@/components/Editor/TableControls';
import { gql, useQuery } from '@apollo/client';
import { Category, Tag } from '@prisma/client';

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

const useOptions = () => {
  const { data, loading } = useQuery<TData>(CategoryAndTagQuery);
  const [categorySelected, setCategorySelected] = useState<string[]>([]);
  const [tagSelected, setTagSelected] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [tagOptions, setTagOptions] = useState<Option[]>([]);

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
    tagSelected,
    categoryOptions,
    categorySelected,
    setCategoryOptions,
    setCategorySelected,
    setTagOptions,
    setTagSelected
  };
};

export default function Demo() {
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
  } = useOptions();

  return (
    <main className='container mx-auto min-h-screen py-4 text-main'>
      <Input
        multiline
        size='xl'
        placeholder='Tiêu đề'
        mb={rem(4)}
        fs={rem(32)}
        variant='unstyled'
      />

      <Group mb={5}>
        <Button
          variant='subtle'
          size='xs'
          px={rem(2)}
          mx={-rem(2)}
          rightIcon={opened ? <IconChevronUp size={rem(14)} /> : <IconChevronDown size={rem(14)} />}
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
          disabled={loading}
          icon={loading ? <Loader size={rem(16)} /> : undefined}
          getCreateLabel={query => `+ ${query}`}
          value={categorySelected}
          onChange={setCategorySelected}
          onCreate={query => {
            const item = { value: query, label: query };
            setCategorySelected(current => [...current, query]);
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
          disabled={loading}
          icon={loading ? <Loader size={rem(16)} /> : undefined}
          getCreateLabel={query => `+ ${query}`}
          value={tagSelected}
          onChange={setTagSelected}
          onCreate={query => {
            const item = { value: query, label: query };
            setTagSelected(current => [...current, query]);
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

      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Button>Đăng bài</Button>
      </Affix>
    </main>
  );
}
