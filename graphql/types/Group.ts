import { builder } from '../builder';

// Group
builder.prismaObject('Group', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    slug: t.exposeString('slug'),
    isPrivate: t.exposeBoolean('isPrivate', { nullable: true }),

    posts: t.relation('posts', {}),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.prismaObject('GroupsOnPosts', {
  fields: t => ({
    post: t.relation('post', {}),
    postId: t.exposeString('postId'),

    group: t.relation('group', {}),
    groupId: t.exposeString('groupId'),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.queryField('groups', t =>
  t.prismaConnection({
    type: 'Group',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) => prisma.group.findMany({ ...query })
  })
);
