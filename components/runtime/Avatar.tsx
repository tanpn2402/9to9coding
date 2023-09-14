import { AvatarProps, Avatar as MantineAvatar } from '@mantine/core';

export const Avatar: React.FC<AvatarProps> = ({ children, ...props }) => {
  let letters = null;
  if (typeof children === 'string') {
    letters = (children as string).match(/\b(\w)/g)?.join('');
  }
  return <MantineAvatar {...props}>{letters ? letters : children}</MantineAvatar>;
};
