import { Card, Group, rem, Spoiler, Flex, TypographyStylesProvider, Skeleton } from '@mantine/core';

export function TweetCardSkeleton() {
  return (
    <Card shadow='sm' radius='md'>
      <Card.Section inheritPadding py='xs'>
        <Group position='apart'>
          <Group>
            <Flex gap='xs'>
              <Group>
                <Skeleton height={40} width={40} circle />
              </Group>
              <Flex gap={rem(2)} direction='column'>
                <Skeleton height={22} width={100} />
                <Skeleton height={16} width={140} />
              </Flex>
            </Flex>
          </Group>
        </Group>
      </Card.Section>

      <Skeleton visible>
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
      </Skeleton>
    </Card>
  );
}
