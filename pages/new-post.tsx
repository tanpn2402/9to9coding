import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
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
import {
  IconColumnInsertRight,
  IconLink,
  IconPhotoPlus,
  IconPhotoShare,
  IconRowInsertBottom,
  IconTable,
  IconUpload
} from '@tabler/icons-react';
import { Button, FileInput, Flex, Loader, Popover, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { forEach, isArray } from 'lodash';

// register languages that your are planning to use
lowlight.registerLanguage('ts', tsLanguageSyntax);

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const content = `<p>Bắt đầu viết những thứ hay ho...</p><p></p>`;

const ButtonStyles = { width: 38, height: 34 };

type InsertPhotoUrlForm = {
  url: string;
};

function InsertPhotoControl() {
  const [opened, setOpened] = useState(false);
  const { editor } = useRichTextEditorContext();
  const insertPhotoURLForm = useForm<InsertPhotoUrlForm>({
    initialValues: {
      url: ''
    },
    validate: {
      url: value =>
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm.test(
          value
        )
          ? null
          : 'Invalid URL'
    }
  });

  const addPhotoFromUrl = ({ url }: InsertPhotoUrlForm) => {
    editor.chain().focus().setImage({ src: url }).run();
    insertPhotoURLForm.reset();
    setOpened(false);
  };

  return (
    <Popover width={350} position='bottom' shadow='md' opened={opened} onChange={setOpened}>
      <Popover.Target>
        <RichTextEditor.Control
          aria-label='Insert photo from URL'
          title='Insert photo from URL'
          style={ButtonStyles}
          onClick={() => setOpened(true)}>
          <IconPhotoPlus stroke={1.5} size='1rem' />
        </RichTextEditor.Control>
      </Popover.Target>
      <Popover.Dropdown>
        <form onSubmit={insertPhotoURLForm.onSubmit(addPhotoFromUrl)}>
          <Flex align='flex-end'>
            <TextInput
              icon={<IconLink size={rem(14)} />}
              placeholder='Enter photo URL'
              size='xs'
              label='Photo URL'
              className='mr-2 w-full'
              {...insertPhotoURLForm.getInputProps('url')}
            />
            <Button type='submit' size='xs'>
              Insert
            </Button>
          </Flex>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
}

function UploadPhotoControl() {
  const [opened, setOpened] = useState(false);
  const { editor } = useRichTextEditorContext();
  const [isLoading, setIsLoading] = useState(false);

  const uploadPhoto = (ev: File | null) => {
    if (ev) {
      const body = new FormData();
      body.append('file', ev);
      setIsLoading(true);
      fetch('/api/file/upload', {
        method: 'POST',
        body
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          if (isArray(json)) {
            forEach(json, (url: string) => {
              editor.chain().focus().setImage({ src: url }).run();
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
          setOpened(false);
        });
    }
  };

  return (
    <>
      <Popover width={250} position='bottom' shadow='md' opened={opened} onChange={setOpened}>
        <Popover.Target>
          <RichTextEditor.Control
            onClick={() => setOpened(true)}
            aria-label='Insert photo from device'
            title='Insert photo from device'
            style={ButtonStyles}>
            <IconPhotoShare stroke={1.5} size='1rem' />
          </RichTextEditor.Control>
        </Popover.Target>
        <Popover.Dropdown>
          <FileInput
            size='xs'
            label='Your photo'
            placeholder='Your photo'
            icon={isLoading ? <Loader size={rem(14)} /> : <IconUpload size={rem(14)} />}
            onChange={uploadPhoto}
            disabled={isLoading}
          />
        </Popover.Dropdown>
      </Popover>
    </>
  );
}

type TableControlProps = {
  isInsertColumnEnable?: boolean;
  isInsertRowEnable?: boolean;
  isDeleteColumnEnable?: boolean;
  isDeleteRowEnable?: boolean;
  isMergeOrSplitEnable?: boolean;
};

const TableControls: React.FC<TableControlProps> = ({
  isDeleteColumnEnable,
  isDeleteRowEnable,
  isInsertColumnEnable,
  isInsertRowEnable,
  isMergeOrSplitEnable
}) => {
  const { editor } = useRichTextEditorContext();

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertColumn = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const insertRow = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const mergeOrSplitCell = () => {
    editor.chain().focus().mergeOrSplit().run();
  };

  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        onClick={() => insertTable()}
        aria-label='Insert table'
        title='Insert table'
        style={ButtonStyles}>
        <IconTable stroke={1.5} size='1rem' />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        disabled={!isInsertColumnEnable}
        onClick={() => insertColumn()}
        aria-label='Insert column'
        title='Insert column'
        style={ButtonStyles}>
        <IconColumnInsertRight stroke={1.5} size='1rem' />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        disabled={!isInsertRowEnable}
        onClick={() => insertRow()}
        aria-label='Insert row'
        title='Insert row'
        style={ButtonStyles}>
        <IconRowInsertBottom stroke={1.5} size='1rem' />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        disabled={!isDeleteColumnEnable}
        onClick={() => deleteColumn()}
        aria-label='Remove column'
        title='Remove column'
        style={ButtonStyles}>
        <svg
          width='1rem'
          height='1rem'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='tabler-icon tabler-icon-column-insert-left'>
          <path d='M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1z' />
          <path
            d='M 0.639 12.268 L 7.838 12.268'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 10.474252, 0.884498)'
          />
          <path
            d='M 3.982 8.503 L 3.982 15.793'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 10.301279, 1.035083)'
          />
        </svg>
      </RichTextEditor.Control>
      <RichTextEditor.Control
        disabled={!isDeleteRowEnable}
        onClick={() => deleteRow()}
        aria-label='Remove row'
        title='Remove row'
        style={ButtonStyles}>
        <svg
          width='1rem'
          height='1rem'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='tabler-icon tabler-icon-row-insert-bottom'>
          <path d='M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z' />
          <path
            d='M 11.292 13.565 L 11.292 19.804'
            style={{}}
            transform='matrix(0.650787, 0.75926, -0.75926, 0.650787, 16.611188, -2.747125)'
          />
          <path
            d='M 14.412 16.684 L 8.172 16.684'
            style={{}}
            transform='matrix(0.650787, 0.75926, -0.75926, 0.650787, 16.610807, -2.747299)'
          />
        </svg>
      </RichTextEditor.Control>
      <RichTextEditor.Control
        disabled={!isMergeOrSplitEnable}
        onClick={() => mergeOrSplitCell()}
        aria-label='Merge or split cell'
        title='Merge or split cell'
        style={ButtonStyles}>
        <svg
          width='1rem'
          height='1rem'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='tabler-icon tabler-icon-column-insert-left'>
          <path d='M 15.211 3.945 L 19.211 3.945 C 19.763 3.945 20.211 4.393 20.211 4.945 L 20.211 18.945 C 20.211 19.497 19.763 19.945 19.211 19.945 L 15.211 19.945 C 14.659 19.945 14.211 19.497 14.211 18.945 L 14.211 4.945 C 14.211 4.393 14.659 3.945 15.211 3.945 Z' />
          <path
            d='M 5.7 12.976 L 8.491 12.976'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 11.935418, -0.998902)'
          />
          <path
            d='M 15.91 7.66 L 8.059 16.294'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 12.798925, -4.946754)'
          />
          <path d='M 4.958 3.945 L 8.958 3.945 C 9.511 3.945 9.958 4.393 9.958 4.945 L 9.958 18.945 C 9.958 19.497 9.511 19.945 8.958 19.945 L 4.958 19.945 C 4.406 19.945 3.958 19.497 3.958 18.945 L 3.958 4.945 C 3.958 4.393 4.406 3.945 4.958 3.945 Z' />
          <path
            d='M 7.157 12.373 L 7.193 9.668'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 10.513463, -1.699041)'
          />
          <path
            d='M 15.538 10.958 L 18.329 10.958'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 13.667299, -8.945595)'
          />
          <path
            d='M 16.865 14.302 L 16.901 11.597'
            style={{}}
            transform='matrix(0.672069, 0.740489, -0.740489, 0.672069, 15.125422, -8.255126)'
          />
        </svg>
      </RichTextEditor.Control>
    </RichTextEditor.ControlsGroup>
  );
};

export default function Demo() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image,
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
    content
  });

  return (
    <main className='container mx-auto min-h-screen py-24 text-main'>
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
    </main>
  );
}
