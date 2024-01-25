import { defineEventHandler, createError, getRouterParam } from 'h3';
import { useModel } from '../../../src';

export const index = defineEventHandler(async (event) => {
  const Post = useModel(event, 'Post');
  const posts = await Post.findAll();

  return posts;
});

export const show = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const Post = useModel(event, 'Post');

  if (!id) throw createError({ statusCode: 500, statusMessage: 'Server error' });

  const post = await Post.findByPk(id, {
    include: [{ association: 'author' }]
  });

  if (!post) throw createError({ statusMessage: 'Post not found', statusCode: 404 });

  return post;
});
