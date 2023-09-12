import { useRichTextEditorContext } from '@mantine/tiptap';
import { IconLink, IconPhotoPlus } from '@tabler/icons-react';
import { Button, Popover, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

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
        <Button
          px={rem(10)}
          variant='default'
          aria-label='Thêm ảnh từ liên kết'
          title='Thêm ảnh từ liên kết'
          onClick={() => setOpened(true)}>
          <IconPhotoPlus stroke={1.5} size='1rem' />
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <form
          onSubmit={ev => {
            ev.preventDefault();
          }}>
          <TextInput
            icon={<IconLink size={rem(14)} />}
            placeholder='Ảnh...'
            size='xs'
            label='Liên kết'
            className='mb-2 w-full'
            {...insertPhotoURLForm.getInputProps('url')}
          />
          <Button
            size='xs'
            variant='default'
            onClick={() => {
              const validationRlt = insertPhotoURLForm.validate();
              if (!validationRlt.hasErrors) {
                insertPhotoURLForm.onSubmit(addPhotoFromUrl)();
              }
            }}>
            Thêm
          </Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
