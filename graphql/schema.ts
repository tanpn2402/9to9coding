// graphql/schema.ts
import './types/User';
import './types/Tag';
import './types/Category';
import './types/Group';
import './types/Comment';
import './types/Post';

import { builder } from './builder';

export const schema = builder.toSchema();
