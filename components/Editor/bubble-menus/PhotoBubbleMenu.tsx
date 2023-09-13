import { BubbleMenu, Editor } from '@tiptap/react';
import { Button, rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

export const PhotoBubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        return editor.isActive('image');
      }}>
      <Button.Group>
        <Button
          px={rem(10)}
          variant='default'
          onClick={() => editor.chain().focus().setImageSize({ width: '25%' }).run()}>
          25%
        </Button>
        <Button
          px={rem(10)}
          variant='default'
          onClick={() => editor.chain().focus().setImageSize({ width: '50%' }).run()}>
          50%
        </Button>
        <Button
          px={rem(10)}
          variant='default'
          onClick={() => editor.chain().focus().setImageSize({ width: '75%' }).run()}>
          75%
        </Button>
        <Button
          px={rem(10)}
          variant='default'
          onClick={() => editor.chain().focus().setImageSize({ width: '100%' }).run()}>
          100%
        </Button>
        <Button
          px={rem(10)}
          variant='default'
          onClick={() => editor.chain().focus().setImageSize({ width: 'unset' }).run()}>
          Raw
        </Button>
        <Button
          px={rem(10)}
          variant='default'
          onClick={() => editor.chain().focus().deleteSelection().run()}>
          <IconTrash size='1rem' />
        </Button>
      </Button.Group>
    </BubbleMenu>
  );
};
