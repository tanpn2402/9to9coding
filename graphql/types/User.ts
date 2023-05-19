import { builder } from '../builder';

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
    email: t.string({ required: true })
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
          email: input.email
        }
      });

      return user;
    }
  })
);
