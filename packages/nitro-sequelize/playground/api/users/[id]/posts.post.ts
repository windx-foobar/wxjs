import { useModel, useSequelize } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title: string; introtext?: string }>(event);
  const id = getRouterParam(event, 'id');
  const sequelize = useSequelize(event);
  const User = useModel(event, 'User');

  if (!id) throw createError({ statusCode: 500, message: 'Server error' });

  let transaction;
  try {
    transaction = await sequelize.transaction();

    const user = await User.findByPk(id, { transaction });
    if (!user) throw createError({ statusCode: 404, message: 'User not found' });

    const newPost = await user.createPost(body, { transaction });

    await transaction.commit();
    return newPost;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
});
