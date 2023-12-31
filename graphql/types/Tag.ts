import prisma from '@/lib/prisma';
import { builder } from '../builder';

// Tag
builder.prismaObject('Tag', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),

    posts: t.relatedConnection('posts', {
      cursor: 'postId_tagId',
      totalCount: true
    }),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.prismaObject('TagsOnPosts', {
  fields: t => ({
    post: t.relation('post', {}),
    postId: t.exposeString('postId'),

    tag: t.relation('tag', {}),
    tagId: t.exposeString('tagId'),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.queryField('tags', t =>
  t.prismaConnection({
    type: 'Tag',
    cursor: 'id',
    totalCount: (_connection, _args, _ctx, _info) => prisma.tag.count(),
    resolve: (query, _parent, _args, _ctx, _info) => prisma.tag.findMany({ ...query })
  })
);

const CreateTagInput = builder.inputType('CreateTagInput', {
  fields: t => ({
    name: t.string({ required: true }),
  })
});

builder.mutationField('createTag', t =>
  t.prismaField({
    type: 'Tag',
    args: {
      input: t.arg({ type: CreateTagInput, required: true })
    },
    resolve: async (query, _, { input }) => {
      const user = await prisma.tag.create({
        data: {
          name: input.name
        }
      });

      return user;
    }
  })
);
