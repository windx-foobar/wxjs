import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const User = useModel(event, 'User');

  if (!id) throw createError({ statusCode: 500, message: 'Server error' });

  const user = await User.findByPk(id, {
    include: [
      { association: 'certificate', attributes: { exclude: ['userId'] } },
      { association: 'services', through: { attributes: [] } },
      { association: 'posts', attributes: { exclude: ['userId'] } }
    ]
  });

  if (!user) throw createError({ message: 'User not found', statusCode: 404 });

  return user;
});
