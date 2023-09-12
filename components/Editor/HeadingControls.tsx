import { Button, Menu, Title, rem } from '@mantine/core';
import { useRichTextEditorContext } from '@mantine/tiptap';
import {
  IconChevronDown,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconHeading,
  IconAlphabetLatin
} from '@tabler/icons-react';
import { Level } from '@tiptap/extension-heading';

export const HeadingControls = () => {
  const { editor } = useRichTextEditorContext();

  const setHeading = (level: Level) => {
    editor.chain().focus().setHeading({ level: level }).run();
  };

  const setParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };

  return (
    <>
      <Button.Group>
        <Button
          px={rem(8)}
          variant={editor?.isActive('paragraph') ? 'outline' : 'default'}
          aria-label='Văn bản'
          title='Văn bản'
          onClick={setParagraph}>
          <IconAlphabetLatin size='1rem' />
        </Button>
        <Menu trigger='hover' openDelay={50} closeDelay={100}>
          <Menu.Target>
            <Button
              px={rem(8)}
              variant={editor?.isActive('heading') ? 'outline' : 'default'}
              aria-label='Heading'
              title='Heading'
              rightIcon={<IconChevronDown size='0.8rem' />}>
              <IconHeading size='1rem' />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<IconH1 size='1.6rem' />}
              onClick={() => setHeading(1)}
              aria-label='Tiêu đề 1'
              title='Tiêu đề 1'>
              <Title size='h1'>Tiêu đề 1</Title>
            </Menu.Item>
            <Menu.Item
              icon={<IconH2 size='1.4rem' />}
              onClick={() => setHeading(2)}
              aria-label='Tiêu đề 2'
              title='Tiêu đề 2'>
              <Title size='h2'>Tiêu đề 2</Title>
            </Menu.Item>
            <Menu.Item
              icon={<IconH3 size='1.2rem' />}
              onClick={() => setHeading(3)}
              aria-label='Tiêu đề 3'
              title='Tiêu đề 3'>
              <Title size='h3'>Tiêu đề 3</Title>
            </Menu.Item>
            <Menu.Item
              icon={<IconH4 size='1rem' />}
              onClick={() => setHeading(4)}
              aria-label='Tiêu đề 4'
              title='Tiêu đề 4'>
              <Title size='h4'>Tiêu đề 4</Title>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Button.Group>
    </>
  );
};
