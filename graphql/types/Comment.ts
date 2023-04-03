import { builder } from '../builder';

// Tag
builder.prismaObject('Comment', {
  fields: t => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    isBlocked: t.exposeBoolean('isBlocked', { nullable: true }),

    post: t.relation('post', {}),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.queryField('comments', t =>
  t.prismaConnection({
    type: 'Comment',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) => prisma.comment.findMany({ ...query })
  })
);
