import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const Post = useModel(event, 'Post');

  if (!id) throw createError({ statusCode: 500, message: 'Server error' });

  const post = await Post.findByPk(id, {
    include: [{ association: 'author' }]
  });

  if (!post) throw createError({ message: 'Post not found', statusCode: 404 });

  return post;
});
