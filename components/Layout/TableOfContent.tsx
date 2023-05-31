import { Card, Image, Text, Badge, Button, Group, Avatar, Flex, rem, Title } from '@mantine/core';

import { IconList } from '@tabler/icons-react';

export const TableOfContent: React.FC<unknown> = () => {
  return (
    <Card shadow='xs' padding='lg' radius='xs'>
      <Group>
        <IconList size={rem(16)} />
        <Title order={4}>Metadata</Title>
      </Group>
    </Card>
  );
};
