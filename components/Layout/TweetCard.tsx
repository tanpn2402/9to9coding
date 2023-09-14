import React from 'react';
import { vi } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import { Card, Group, Text, Spoiler, Flex, TypographyStylesProvider } from '@mantine/core';
import type { Category, Post, Tag, User } from '@prisma/client';
import { TweetCardMenu } from './TweetCardMenu';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { Avatar } from '../runtime/Avatar';

type Props = {
  post: Post;
  categories?: Category[];
  tags?: Tag[];
  author: User;
};

export const TweetCard: React.FC<Props> = ({ post, author, tags = [], categories = [] }) => {
  return (
    <Card shadow='sm' radius='md'>
      <Card.Section inheritPadding py='xs'>
        <Group position='apart'>
          <Group>
            <Flex gap='xs'>
              <Group>
                <Avatar color='cyan' radius='xl' size={40}>
                  {author.name}
                </Avatar>
              </Group>
              <Group display='block'>
                <Text weight={600}>{author.name}</Text>
                <Text weight={400} size='xs'>
                  {author.email} ·{' '}
                  {post.createdAt
                    ? formatDistance(new Date(post.createdAt), new Date(), {
                        includeSeconds: true,
                        locale: vi
                      })
                    : ''}
                </Text>
              </Group>
            </Flex>
          </Group>
          <TweetCardMenu post={post} author={author} />
        </Group>
      </Card.Section>

      <Spoiler
        maxHeight={280}
        showLabel={
          <Flex align='center' gap='sm' pt='lg'>
            <IconChevronDown />
            <Text size='sm'>Đọc tiếp</Text>
          </Flex>
        }
        hideLabel={
          <Flex align='center' gap='sm' pt='lg'>
            <IconChevronUp />
            <Text size='sm'>Ẩn bớt đi</Text>
          </Flex>
        }>
        <Card.Section inheritPadding pb='md'>
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html: post.content
              }}
            />
          </TypographyStylesProvider>
        </Card.Section>
      </Spoiler>
    </Card>
  );
};
