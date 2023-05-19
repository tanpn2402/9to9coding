import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconPhotoShare, IconUpload } from '@tabler/icons-react';
import { FileInput, Loader, Popover, rem } from '@mantine/core';
import { useState } from 'react';
import { forEach, isArray } from 'lodash';

const ButtonStyles = { width: 38, height: 34 };

export const UploadPhotoControl: React.FC<object> = () => {
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
};
