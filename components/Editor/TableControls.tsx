import { Button, Menu, Text, rem } from '@mantine/core';
import { useRichTextEditorContext } from '@mantine/tiptap';
import {
  IconColumnInsertRight,
  IconRowInsertBottom,
  IconTable,
  IconChevronDown
} from '@tabler/icons-react';

export const TableControls: React.FC<unknown> = () => {
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
    <>
      <Menu trigger='hover' openDelay={50} closeDelay={100}>
        <Menu.Target>
          <Button
            px={rem(10)}
            variant='default'
            aria-label='Bảng'
            title='Bảng'
            rightIcon={<IconChevronDown size='0.8rem' />}>
            <IconTable size='1rem' />
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<IconTable stroke={1.5} size='1rem' />} onClick={() => insertTable()}>
            <Text>Thêm bảng</Text>
          </Menu.Item>
          <Menu.Item
            disabled={!editor?.can().addColumnAfter()}
            icon={<IconColumnInsertRight stroke={1.5} size='1rem' />}
            onClick={() => insertColumn()}>
            <Text>Thêm cột bên phải</Text>
          </Menu.Item>
          <Menu.Item
            disabled={!editor?.can().addRowAfter()}
            icon={<IconRowInsertBottom stroke={1.5} size='1rem' />}
            onClick={() => insertRow()}>
            <Text>Thêm hàng vào dưới</Text>
          </Menu.Item>
          <Menu.Item
            disabled={!editor?.can().deleteColumn()}
            icon={
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
            }
            onClick={() => deleteColumn()}>
            <Text>Xóa cột</Text>
          </Menu.Item>
          <Menu.Item
            disabled={!editor?.can().deleteRow()}
            icon={
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
            }
            onClick={() => deleteRow()}>
            <Text>Xóa hàng</Text>
          </Menu.Item>
          <Menu.Item
            disabled={!editor?.can().mergeOrSplit()}
            icon={
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
            }
            onClick={() => mergeOrSplitCell()}>
            <Text>Gộp hoặc tách ô</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
