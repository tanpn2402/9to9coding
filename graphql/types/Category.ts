import prisma from '@/lib/prisma';
import { builder } from '../builder';

// Category
builder.prismaObject('Category', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    color: t.exposeString('color', { nullable: true }),
    slug: t.exposeString('slug'),
    isPrivate: t.exposeBoolean('isPrivate', { nullable: true }),

    posts: t.relatedConnection('posts', {
      cursor: 'postId_categoryId',
      totalCount: true
    }),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.prismaObject('CategoriesOnPosts', {
  fields: t => ({
    post: t.relation('post', {}),
    postId: t.exposeString('postId'),

    category: t.relation('category', {}),
    categoryId: t.exposeString('categoryId'),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.queryField('categories', t =>
  t.prismaConnection({
    type: 'Category',
    cursor: 'id',
    totalCount: (_connection, _args, _ctx, _info) => prisma.category.count(),
    resolve: (query, _parent, _args, _ctx, _info) => prisma.category.findMany({ ...query })
  })
);
