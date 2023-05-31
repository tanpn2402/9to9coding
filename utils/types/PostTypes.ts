import type {
  Post,
  User,
  Profile,
  Category,
  Tag,
  CategoriesOnPosts,
  TagsOnPosts
} from '@prisma/client';

export type PostTypes = Post & {
  author: User & { profile: Profile };
  categories: (CategoriesOnPosts & { category: Category })[];
  tags: (TagsOnPosts & { tag: Tag })[];
};
