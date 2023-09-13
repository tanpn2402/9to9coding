import { BubbleMenu, Editor } from '@tiptap/react';
import { Button, Flex, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

type UrlForm = {
  url: string;
};

export const LinkBubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const urlForm = useForm<UrlForm>({
    validate: {
      url: value =>
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm.test(
          value
        )
          ? null
          : 'Invalid URL'
    }
  });

  const updateUrl = ({ url }: UrlForm) => {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  };

  const removeUrl = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  useEffect(() => {
    urlForm.setFieldValue('url', editor.getAttributes('link').href);
  }, [editor.getAttributes('link').href]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        return from === to && editor.isActive('link');
      }}>
      <form
        onSubmit={ev => {
          ev.preventDefault();
        }}>
        <Flex
          gap={2}
          sx={theme => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            padding: theme.spacing.xs,
            borderRadius: theme.radius.xs
          })}>
          {
            <TextInput
              size='xs'
              placeholder='Url'
              type='text'
              sx={{ minWidth: 200 }}
              {...urlForm.getInputProps('url')}
            />
          }
          <Button
            size='xs'
            variant='default'
            onClick={() => {
              const validationRlt = urlForm.validate();
              if (!validationRlt.hasErrors) {
                urlForm.onSubmit(updateUrl)();
              }
            }}>
            Cập nhật
          </Button>
          <Button size='xs' variant='default' onClick={removeUrl}>
            Xóa
          </Button>
        </Flex>
      </form>
    </BubbleMenu>
  );
};
