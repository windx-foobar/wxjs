import { useModel, useSequelize } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const sequelize = useSequelize(event);
  const User = useModel(event, 'User');

  if (!id) throw createError({ statusCode: 500, message: 'Server error' });

  let transaction;
  try {
    transaction = await sequelize.transaction();
    const user = await User.findByPk(id, { transaction });

    if (!user) throw createError({ message: 'User not found', statusCode: 404 });

    await user.destroy({ transaction });

    await transaction.commit();
    return user;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
});
