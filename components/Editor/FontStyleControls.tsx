import { Button, Flex, Menu, Popover, Text, Title, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import {
  IconColumnInsertRight,
  IconRowInsertBottom,
  IconTable,
  IconChevronDown,
  IconChevronUp,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconAlignLeft,
  IconAlignRight,
  IconAlignCenter,
  IconBold,
  IconItalic,
  IconUnderline,
  IconDots,
  IconStrikethrough,
  IconClearFormatting,
  IconHighlight,
  IconCode,
  IconBlockquote,
  IconList,
  IconListNumbers,
  IconCodeDots,
  IconLink,
  IconLinkOff
} from '@tabler/icons-react';
import { TableControls } from './TableControls';

export const FontStyleControls = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <>
      <Button.Group>
        <Button
          variant={editor?.isActive({ textAlign: 'left' }) ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='Căn trái'
          title='Căn trái'
          onClick={() => {
            editor.chain().focus().setTextAlign('left').run();
          }}>
          <IconAlignLeft size='1rem' />
        </Button>
        <Button
          variant={editor?.isActive({ textAlign: 'center' }) ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='Căn giữa'
          title='Căn giữa'
          onClick={() => {
            editor.chain().focus().setTextAlign('center').run();
          }}>
          <IconAlignCenter size='1rem' />
        </Button>
        <Button
          variant={editor?.isActive({ textAlign: 'right' }) ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='Căn phải'
          title='Căn phải'
          onClick={() => {
            editor.chain().focus().setTextAlign('right').run();
          }}>
          <IconAlignRight size='1rem' />
        </Button>
      </Button.Group>

      <Button.Group>
        <Button
          variant={editor?.isActive('bold') ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='In đậm'
          title='In đậm'
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}>
          <IconBold size='1rem' />
        </Button>
        <Button
          variant={editor?.isActive('italic') ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='In nghiêng'
          title='In nghiêng'
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}>
          <IconItalic size='1rem' />
        </Button>
        <Button
          variant={editor?.isActive('underline') ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='Gạch chân'
          title='Gạch chân'
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
          }}>
          <IconUnderline size='1rem' />
        </Button>
        <Button
          variant={editor?.isActive('code') ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='Code'
          title='Code'
          onClick={() => {
            editor.chain().focus().toggleCode().run();
          }}>
          <IconCode size='1rem' />
        </Button>
        <Button
          variant={editor?.isActive('codeBlock') ? 'outline' : 'default'}
          px={rem(10)}
          aria-label='Code block'
          title='Code block'
          onClick={() => {
            editor.chain().focus().toggleCodeBlock().run();
          }}>
          <IconCodeDots size='1rem' />
        </Button>
        <TableControls />
        <Menu trigger='hover' openDelay={50} closeDelay={100}>
          <Menu.Target>
            <Button
              px={rem(10)}
              variant='default'
              aria-label='Thêm chức năng'
              title='Thêm chức năng'>
              <IconDots size='1rem' />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<IconStrikethrough size='1rem' />}
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
              }}>
              <Text>Gạch ngang</Text>
            </Menu.Item>
            {/* <Menu.Item
              icon={<IconHighlight size='1rem' />}
              onClick={() => {
                editor.chain().focus().setHighlight().run();
              }}>
              <Text>Highlight</Text>
            </Menu.Item> */}
            <Menu.Item
              icon={<IconBlockquote size='1rem' />}
              onClick={() => {
                editor.chain().focus().toggleBlockquote().run();
              }}>
              <Text>Quote</Text>
            </Menu.Item>
            <Menu.Item
              icon={<IconList size='1rem' />}
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
              }}>
              <Text>Danh sách</Text>
            </Menu.Item>
            <Menu.Item
              icon={<IconListNumbers size='1rem' />}
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
              }}>
              <Text>Danh sách</Text>
            </Menu.Item>
            <Menu.Item
              icon={<IconLink size='1rem' />}
              onClick={() => {
                editor.chain().focus().setLink({ href: '' }).run();
              }}
              disabled={!editor?.can().setLink({ href: '' })}>
              <Text>Thêm liên kết</Text>
            </Menu.Item>
            <Menu.Item
              icon={<IconLinkOff size='1rem' />}
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
              disabled={!editor?.can().unsetLink()}>
              <Text>Bỏ liên kết</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Button.Group>
    </>
  );
};
