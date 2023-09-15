import React from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { lowlight } from 'lowlight';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import javaLanguageSyntax from 'highlight.js/lib/languages/java';
import jsLanguageSyntax from 'highlight.js/lib/languages/javascript';
import { Button } from '@mantine/core';
import { InsertPhotoControl } from '@/components/Editor/InsertPhotoControl';
import { UploadPhotoControl } from '@/components/Editor/UploadPhotoControl';
import { HeadingControls } from '@/components/Editor/HeadingControls';
import { FontStyleControls } from '@/components/Editor/FontStyleControls';
import { Editor } from '@tiptap/react';

// register languages that your are planning to use
lowlight.registerLanguage('ts', tsLanguageSyntax);
lowlight.registerLanguage('java', javaLanguageSyntax);
lowlight.registerLanguage('js', jsLanguageSyntax);

type Props = {
  editor: Editor | null;
};

const TextEditor: React.FC<Props> = ({ editor }) => {
  return (
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
  );
};

export default TextEditor;
