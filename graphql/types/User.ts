import prisma from '@/lib/prisma';
import { builder } from '../builder';
import { isEmpty, isNil } from 'lodash';
import { fakeName } from '@/utils';
import { setCookie } from 'cookies-next';

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

builder.prismaObject('Account', {
  fields: t => ({
    id: t.exposeID('id'),
    user: t.relation('user', {}),
    username: t.expose('username', { type: 'String' }),
    password: t.expose('password', { type: 'String' }),
    status: t.expose('status', { nullable: true, type: 'String' }),
    failedAttempt: t.expose('failedAttempt', { type: 'Int' }),

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
    account: t.relation('account', {}),

    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    modifiedAt: t.expose('modifiedAt', { type: 'DateTime', nullable: true })
  })
});

builder.queryField('users', t =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    totalCount: (_connection, _args, _ctx, _info) => prisma.user.count(),
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.user.findMany({
        ...query,
        include: {
          account: false
        }
      })
  })
);

builder.queryField('userById', t =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      id: t.arg.string({ required: true })
    },
    resolve: async (query, _, { id }) => {
      const user = await prisma.user.findFirst({
        where: {
          id
        },
        include: {
          account: false,
          posts: false,
          profile: true
        }
      });

      return user;
    }
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
          username: isEmpty(input.username) ? fakeName() : input.username
        }
      });

      return user;
    }
  })
);

builder.mutationField('signUp', t =>
  t.prismaField({
    type: 'User',
    args: {
      email: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      username: t.arg.string({ required: false }),
      password: t.arg.string({ required: true })
    },
    resolve: async (query, _, { email, name, password, username: _username }) => {
      const username = isNil(_username) || isEmpty(_username) ? fakeName() : _username;
      const createdUser = await prisma.user.create({
        data: {
          name: name,
          surname: name,
          email: email,
          username,
          account: {
            create: {
              username,
              password,
              status: 'A'
            }
          },
          profile: {
            create: {
              bio: 'Bio'
            }
          }
        },
        include: {
          account: false
        }
      });

      return createdUser;
    }
  })
);

builder.mutationField('signIn', t =>
  t.prismaField({
    type: 'User',
    args: {
      email: t.arg.string({ required: false }),
      username: t.arg.string({ required: false }),
      password: t.arg.string({ required: true })
    },
    resolve: async (query, _, { email, password, username }, ctx) => {
      const condition: any = {};
      if (username) {
        condition['account'] = {
          username: username ?? ''
        };
      }
      if (email) {
        condition['email'] = email;
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: condition
        },
        include: {
          account: {
            select: {
              id: true,
              status: true,
              password: true,
              failedAttempt: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Invalid data');
      }

      if (!user.account) {
        throw new Error('Invalid data');
      }

      if (user.account.status !== 'A') {
        throw new Error('Blocked');
      }

      if (user.account.password !== password) {
        await prisma.account.update({
          data: {
            failedAttempt: (user?.account?.failedAttempt ?? 0) + 1,
            status: user?.account?.failedAttempt >= 9 ? 'L' : user?.account.status
          },
          where: {
            id: user?.account?.id
          }
        });
        throw new Error('Invalid data');
      }

      const selectedUser = await prisma.user.findFirst({
        where: {
          id: user.id
        }
      });

      setCookie('X-3X-4X', selectedUser?.id, {
        req: (await ctx).req,
        res: (await ctx).res,
        maxAge: 60 * 6 * 24
      });

      return selectedUser!;
    }
  })
);
