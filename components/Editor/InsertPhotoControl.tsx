import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconLink, IconPhotoPlus } from '@tabler/icons-react';
import { Button, Flex, Popover, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

const ButtonStyles = { width: 38, height: 34 };

type InsertPhotoUrlForm = {
  url: string;
};

export const InsertPhotoControl: React.FC<object> = () => {
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
};
