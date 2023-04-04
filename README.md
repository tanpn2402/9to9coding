NextJS + Typescript + Prisma + Apollo + Graph


Stacks and tools:
* `prisma`: a command line tool used for managing database migrations, generating the database client, and browsing data with Prisma Studio
* `@prisma/client`: a type-safe query builder based on your database schema
* `graphql-yoga`: The fully-featured GraphQL Server
* `@pothos/plugin-relay`: handling relay-style cursor-pagination with nodes, connections, and other helpful utilities
* `@apollo/client`: Apollo Client in Next.js
* `@pothos/core`: define GraphQL schema using code
* `graphql-scalars`: a library that provides custom GraphQL scalar types
* `@auth0/nextjs-auth0`: a library for implementing user authentication in Next.js applications.


# Prisma
> https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw

# Apollo GraphQL
> https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-2-fwpc6ds155

# Authentication with Auth0
> https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-3-clxbrcqppv

## Configure Auth0
Create new account at [Auth0 signup](https://auth0.com/signup).

Authen endpoints:
* `/api/auth/login`: Auth0's login route.
* `/api/auth/logout`: The route used to logout the user.
* `/api/auth/callback`: The route Auth0 redirects the user to after a successful login.
* `/api/auth/me`: The route to fetch the user profile from Auth0.