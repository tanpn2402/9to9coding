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
    type: 'Post',
    cursor: 'id',
    totalCount: (_connection, _args, _ctx, _info) => prisma.post.count(),
    resolve: (query, _parent, _args, _ctx, _info) => prisma.post.findMany({ ...query })
  })
);

builder.mutationField('createPost', t =>
  t.prismaField({
    type: 'Post',
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      content: t.arg.string({ required: true }),
      slug: t.arg.string({ required: true }),
      authorId: t.arg.string({ required: true })
    },
    resolve: async (query, _parent, args, ctx) => {
      const { title, description, content, slug, authorId } = args;

      if (!(await ctx).user) {
        throw new Error('You have to be logged in to perform this action');
      }

      return prisma.post.create({
        ...query,
        data: {
          title,
          description,
          content,
          slug: slug.toLowerCase().replaceAll(' ', '-'),
          authorId
        }
      });
    }
  })
);
