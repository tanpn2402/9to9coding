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
  IconPhoto,
  IconRowInsertBottom,
  IconTable
} from '@tabler/icons-react';
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

const content = `<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2>
  <p>
    <code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:
  </p>
  <ul>
    <li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s>
    </li>
    <li>Headings (h1-h6)</li>
    <li>Sub and super scripts ( <sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags) </li>
    <li>Ordered and bullet lists</li>
    <li>Text align&nbsp;</li>
    <li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a>
    </li>
  </ul>
  <pre>
  <code>${escapeHtml(`// Valid braces Kata – https://www.codewars.com/kata/5277c8a221e209d3f6000b56

  const pairs: Record<string, string> = {
    '[': ']',
    '{': '}',
    '(': ')',
  };
  
  const openBraces = Object.keys(pairs);
  
  export function validBraces(braces: string) {
    const opened: string[] = [];
  
    for (let i = 0; i < braces.length; i += 1) {
      const brace = braces[i];
  
      if (openBraces.includes(brace)) {
        opened.push(brace);
        continue;
      }
  
      if (pairs[opened[opened.length - 1]] !== brace) {
        return false
      }
  
      opened.pop();
    }
  
    return opened.length === 0;
  }`)}</code>
  </pre>
  <p>Table</p>
  <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th colspan="3">Description</th>
          </tr>
          <tr>
            <td>Cyndi Lauper</td>
            <td>singer</td>
            <td>songwriter</td>
            <td>actress</td>
          </tr>
          <tr>
            <td>Marie Curie</td>
            <td>scientist</td>
            <td>chemist</td>
            <td>physicist</td>
          </tr>
          <tr>
            <td>Indira Gandhi</td>
            <td>prime minister</td>
            <td colspan="2">politician</td>
          </tr>
        </tbody>
      </table>`;

const ButtonStyles = { width: 38, height: 34 };

function InsertPhotoControl() {
  const { editor } = useRichTextEditorContext();

  const addImage = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <RichTextEditor.Control
      onClick={() => addImage()}
      aria-label='Insert photo'
      title='Insert photo'
      style={ButtonStyles}>
      <IconPhoto stroke={1.5} size='1rem' />
    </RichTextEditor.Control>
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
