import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import prisma from '@/lib/prisma';
import RelayPlugin from '@pothos/plugin-relay';
import { DateTimeResolver } from 'graphql-scalars';

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
  prisma: {
    client: prisma
  }
});

builder.queryType({
  fields: t => ({
    // Health Check
    hc: t.boolean({
      resolve: () => true
    })
  })
});

builder.mutationType();

builder.addScalarType('DateTime', DateTimeResolver, {});
