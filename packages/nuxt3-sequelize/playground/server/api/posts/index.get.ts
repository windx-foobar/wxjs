import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const Post = useModel(event, 'Post');
  const posts = await Post.findAll();

  return posts;
});
