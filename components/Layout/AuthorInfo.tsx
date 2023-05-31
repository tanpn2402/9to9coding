import { Card, Text, Button, Group, Avatar, Flex, rem, Space, Title } from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { Profile, User } from '@prisma/client';
import { IconAt, IconEdit, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

type Props = Partial<Omit<User & { profile: Profile }, 'emailVerified'>> & {
  postId: string;
};

export const AuthorInfo: React.FC<Props> = ({ name, email, username, profile, postId }) => {
  const { user } = useUser();

  return (
    <>
      <Card shadow='xs' padding='lg' radius='xs'>
        <Flex align='center' justify='center'>
          <Avatar src={profile?.picture} color='green' radius='xl' size='lg'>
            {name}
          </Avatar>
        </Flex>

        <Group grow mt='md' mb='xs'>
          <Text align='center' weight={500}>
            {name}
          </Text>
        </Group>

        <Text size='sm' color='dimmed'>
          {profile?.bio}
        </Text>
        <Space h='xl' />
        <Button
          variant='subtle'
          color='blue'
          fullWidth
          radius='md'
          leftIcon={<IconUser size={rem(16)} />}
          p={0}
          styles={{
            inner: {
              justifyContent: 'flex-start'
            }
          }}>
          {`/m/${username}`}
        </Button>
        <Button
          variant='subtle'
          color='blue'
          fullWidth
          radius='md'
          leftIcon={<IconAt size={rem(16)} />}
          p={0}
          styles={{
            inner: {
              justifyContent: 'flex-start'
            }
          }}>
          {`/m/${email}`}
        </Button>
      </Card>
      {user?.email === email && (
        <>
          <Space h='xl' />
          <Card shadow='xs' padding='lg' radius='xs'>
            <Group mb='xl'>
              <IconEdit size={rem(16)} />
              <Title order={4}>Chỉnh sửa</Title>
            </Group>
            <Link href={`/edit?id=${postId}`}>
              <Button variant='light' fullWidth radius='md'>
                Chỉnh sửa
              </Button>
            </Link>
            <Button mt='lg' variant='outline' fullWidth radius='md' color='red'>
              Gỡ bài
            </Button>
          </Card>
        </>
      )}
    </>
  );
};
