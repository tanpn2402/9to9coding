import { map, padStart } from 'lodash';
import generateSlug from 'slug';
import prisma from '@/lib/prisma';
import { builder } from '../builder';
import { Prisma } from '@prisma/client';
import { InputFieldRef } from '@pothos/core';

builder.prismaObject('Post', {
  fields: t => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    content: t.exposeString('content'),
    slug: t.exposeString('slug'),
    type: t.expose('type', { type: PostStatus, nullable: true }),

    author: t.relation('author', {}),
    categories: t.relation('categories', {}),
    groups: t.relation('groups', {}),
    tags: t.relation('tags', {}),
    comments: t.relatedConnection('comments', {
      cursor: 'id',
      totalCount: true
    }),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

const PostStatus = builder.enumType('PostStatus', {
  values: ['DRAFT', 'PUBLISHED', 'BLOCKED', 'DELETED'] as const
});

builder.queryField('posts', t =>
  t.prismaConnection({
    args: {
      orderBy: t.arg.string()
    },
    type: 'Post',
    cursor: 'id',
    totalCount: (_connection, _args, _ctx, _info) => prisma.post.count(),
    resolve: (query, _parent, args, _ctx, _info) => {
      const orderBy: Prisma.PostOrderByWithAggregationInput = {};
      (args.orderBy ?? '').split(',').forEach(sortBy => {
        const [name, direction] = sortBy.split(':');
        const key = name as keyof Prisma.PostOrderByWithAggregationInput;
        const order = direction as Prisma.SortOrder;
        orderBy[key] = order;
      });
      return prisma.post.findMany({
        ...query,
        orderBy
      });
    }
  })
);

builder.mutationField('createPost', t =>
  t.prismaField({
    type: 'Post',
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      content: t.arg.string({ required: true }),
      categories: t.arg.stringList({ required: false }),
      tags: t.arg.stringList({ required: false })
    },
    resolve: async (query, _parent, args, ctx) => {
      const { title, description, content, categories, tags } = args;

      const author = (await ctx).user;

      if (!author) {
        throw new Error('You have to be logged in to perform this action');
      }

      const lastIndex = await prisma.post.count();

      return prisma.post.create({
        ...query,
        data: {
          slug: generateSlug(title + '-' + padStart('post' + lastIndex + 1, 10)),
          title,
          description,
          content,
          authorId: author.id,
          tags: {
            create: map(tags, tag => ({
              tag: {
                connectOrCreate: {
                  where: {
                    id: tag
                  },
                  create: {
                    id: tag,
                    name: tag
                  }
                }
              }
            }))
          },
          categories: {
            create: map(categories, category => ({
              category: {
                connectOrCreate: {
                  where: {
                    id: category
                  },
                  create: {
                    slug: generateSlug(category),
                    id: category,
                    name: category
                  }
                }
              }
            }))
          }
        }
      });
    }
  })
);

builder.mutationField('updatePost', t =>
  t.prismaField({
    type: 'Post',
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      content: t.arg.string({ required: true }),
      categories: t.arg.stringList({ required: false }),
      tags: t.arg.stringList({ required: false })
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, title, description, content, categories, tags } = args;

      const author = (await ctx).user;

      if (!author) {
        throw new Error('You have to be logged in to perform this action');
      }

      prisma.tagsOnPosts.findMany({
        select: {},
        where: {
          tagId: {
            in: tags ?? []
          }
        }
      });

      return prisma.post.update({
        ...query,
        where: {
          id
        },
        data: {
          title,
          description,
          content,
          authorId: author.id,
          tags: {
            connectOrCreate: map(tags, tag => ({
              where: {
                postId_tagId: {
                  postId: id,
                  tagId: tag
                }
              },
              create: {
                tag: {
                  connectOrCreate: {
                    where: {
                      id: tag
                    },
                    create: {
                      id: tag,
                      name: tag
                    }
                  }
                }
              }
            }))
          },
          categories: {
            connectOrCreate: map(categories, category => ({
              where: {
                postId_categoryId: {
                  postId: id,
                  categoryId: category
                }
              },
              create: {
                category: {
                  connectOrCreate: {
                    where: {
                      id: category
                    },
                    create: {
                      slug: generateSlug(category),
                      id: category,
                      name: category
                    }
                  }
                }
              }
            }))
          }
        }
      });
    }
  })
);
