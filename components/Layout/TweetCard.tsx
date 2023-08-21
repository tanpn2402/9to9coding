import {
  Card,
  Group,
  Text,
  Menu,
  ActionIcon,
  rem,
  Spoiler,
  Flex,
  Avatar,
  TypographyStylesProvider
} from '@mantine/core';
import { IconDots, IconEye, IconFileZip, IconTrash } from '@tabler/icons-react';

export function TweetCard() {
  return (
    <Card shadow='sm' radius='md'>
      <Card.Section inheritPadding py='xs'>
        <Group position='apart'>
          <Group>
            <Flex gap='xs'>
              <Group>
                <Avatar color='cyan' radius='xl' size={40}>
                  MK
                </Avatar>
              </Group>
              <Group display='block'>
                <Text weight={500}>Guy 1</Text>
                <Text weight={400} size='xs'>
                  1232
                </Text>
              </Group>
            </Flex>
          </Group>
          <Menu withinPortal position='bottom-end' shadow='sm'>
            <Menu.Target>
              <ActionIcon>
                <IconDots size='1rem' />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconFileZip size={rem(14)} />}>Download zip</Menu.Item>
              <Menu.Item icon={<IconEye size={rem(14)} />}>Preview all</Menu.Item>
              <Menu.Item icon={<IconTrash size={rem(14)} />} color='red'>
                Delete all
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Spoiler maxHeight={120} showLabel='Read more' hideLabel='Hide'>
        <Card.Section inheritPadding pb='md'>
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<h2>  <a name="trending-in-java" href="#trending-in-java">  </a>  Trending in Java</h2><p>The Java community is currently focused on mastering <strong>Spring Data</strong>, exploring the magic of <strong>Java Frameworks</strong> and the <strong>Reflection API</strong>, and discussing effective approaches to <strong>Java Web Development</strong> for beginners.</p>'
              }}
            />
          </TypographyStylesProvider>
        </Card.Section>
      </Spoiler>
    </Card>
  );
}
