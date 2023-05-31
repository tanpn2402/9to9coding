import { builder } from '../builder';

builder.prismaObject('Profile', {
  fields: t => ({
    id: t.exposeID('id'),
    user: t.relation('user', {}),
    bio: t.expose('bio', { nullable: true, type: 'String' }),
    picture: t.expose('picture', { nullable: true, type: 'String' }),
    address: t.expose('address', { nullable: true, type: 'String' }),
    postalCode: t.expose('postalCode', { nullable: true, type: 'String' }),
    country: t.expose('country', { nullable: true, type: 'String' }),
    city: t.expose('city', { nullable: true, type: 'String' }),
    province: t.expose('province', { nullable: true, type: 'String' }),
    mobile: t.expose('mobile', { nullable: true, type: 'String' }),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.prismaObject('User', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    surname: t.exposeString('surname'),
    email: t.exposeString('email'),
    emailVerified: t.expose('emailVerified', { type: 'DateTime', nullable: true }),

    posts: t.relatedConnection('posts', {
      cursor: 'id',
      totalCount: true
    }),
    profile: t.relation('profile', {}),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.queryField('users', t =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    totalCount: (_connection, _args, _ctx, _info) => prisma.user.count(),
    resolve: (query, _parent, _args, _ctx, _info) => prisma.user.findMany({ ...query })
  })
);

const CreateUserInput = builder.inputType('CreateUser', {
  fields: t => ({
    name: t.string({ required: true }),
    surname: t.string({ required: true }),
    email: t.string({ required: true }),
    username: t.string({ required: true })
  })
});

builder.mutationField('createUser', t =>
  t.prismaField({
    type: 'User',
    args: {
      input: t.arg({ type: CreateUserInput, required: true })
    },
    resolve: async (query, _, { input }) => {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          surname: input.surname,
          email: input.email,
          username: input.username
        }
      });

      return user;
    }
  })
);
