import { builder } from '../builder';

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
    comments: t.relation('comments', {}),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

const PostStatus = builder.enumType('PostStatus', {
  values: ['DRAFT', 'PUBLISHED', 'BLOCKED', 'DELETED'] as const
});

builder.queryField('posts', t =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) => prisma.post.findMany({ ...query })
  })
);