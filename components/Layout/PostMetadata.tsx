import { Card, Badge, Group, Flex, rem, Title, Space } from '@mantine/core';
import { Category, Tag } from '@prisma/client';
import { map, toLower } from 'lodash';
import { IconBrandDenodo } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
  categories?: Category[];
  tags?: Tag[];
};

export const PostMetadata: React.FC<Props> = ({ tags, categories }) => {
  return (
    <Card shadow='xs' padding='lg' radius='xs'>
      <Group>
        <IconBrandDenodo size={rem(16)} />
        <Title order={4}>Metadata</Title>
      </Group>
      <Space h='xl' />
      <Title order={6}>Chủ đề</Title>
      <Flex wrap='wrap'>
        {map(categories, c => (
          <Link key={c.id} href={`/topic/${c.slug}`}>
            <Badge
              m={rem(2)}
              size='xl'
              radius='sm'
              px={rem(4)}
              py={rem(2)}
              sx={{ textTransform: 'lowercase' }}>
              {toLower(c.name)}
            </Badge>
          </Link>
        ))}
      </Flex>
      <Space h='xl' />
      <Title order={6}>Tags</Title>
      <Flex wrap='wrap'>
        {map(tags, tag => (
          <Link key={tag.id} href={`/tag/${tag.name}`}>
            <Badge m={rem(2)} size='sm' radius='sm' sx={{ textTransform: 'lowercase' }}>
              {toLower(tag.name)}
            </Badge>
          </Link>
        ))}
      </Flex>
    </Card>
  );
};
