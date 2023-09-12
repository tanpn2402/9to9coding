import React from 'react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor, BubbleMenu } from '@tiptap/react';
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
import javaLanguageSyntax from 'highlight.js/lib/languages/java';
import jsLanguageSyntax from 'highlight.js/lib/languages/javascript';
import { Button } from '@mantine/core';
import { InsertPhotoControl } from '@/components/Editor/InsertPhotoControl';
import { UploadPhotoControl } from '@/components/Editor/UploadPhotoControl';
import { HeadingControls } from '@/components/Editor/HeadingControls';
import { FontStyleControls } from '@/components/Editor/FontStyleControls';

// register languages that your are planning to use
lowlight.registerLanguage('ts', tsLanguageSyntax);
lowlight.registerLanguage('java', javaLanguageSyntax);
lowlight.registerLanguage('js', jsLanguageSyntax);

type Props = {
  content?: string;
};

const Editor: React.FC<Props> = ({ content }) => {
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
    content: content
  });

  return (
    <>
      <RichTextEditor editor={editor} className='max-w-[768px] min-h-[300px] flex-1'>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <HeadingControls />
          <FontStyleControls />
          <Button.Group>
            <InsertPhotoControl />
            <UploadPhotoControl />
          </Button.Group>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor, view, state, oldState, from, to }) => {
            return editor.isActive('image');
          }}>
          <Button.Group>
            <Button
              variant='default'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'is-active' : ''}>
              bold
            </Button>
            <Button
              variant='default'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'is-active' : ''}>
              italic
            </Button>
            <Button
              variant='default'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor?.isActive('strike') ? 'is-active' : ''}>
              strike
            </Button>
          </Button.Group>
        </BubbleMenu>
      )}
    </>
  );
};

export default Editor;
