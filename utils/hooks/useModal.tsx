import { useDisclosure } from '@mantine/hooks';
import { Modal, useMantineTheme } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  centered?: boolean;
  children?: ReactNode;
  childrenFn?: (args: {
    opened: boolean;
    triggerOpen: () => void;
    triggerClose: () => void;
  }) => ReactNode;
};

export const useModal = ({ title, centered, children, childrenFn }: Props) => {
  const [opened, { open: triggerOpen, close: triggerClose }] = useDisclosure(false);
  const theme = useMantineTheme();

  const modal = (
    <Modal
      opened={opened}
      onClose={triggerClose}
      title={title}
      centered={centered}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3
      }}>
      {children ? children : null}
      {childrenFn ? childrenFn({ opened, triggerOpen, triggerClose }) : null}
    </Modal>
  );

  return {
    modal,
    opened,
    triggerOpen,
    triggerClose
  };
};
