import { isArrayString, isNumeric } from '@windx-foobar/shared';
import { useModel, useSequelize } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const body: { services?: string[] } = await readBody(event);
  const id = getRouterParam(event, 'id');
  const sequelize = useSequelize(event);
  const User = useModel(event, 'User');
  const Service = useModel(event, 'Service');

  if (!id) throw createError({ statusCode: 500, message: 'Server error' });

  let transaction;
  try {
    transaction = await sequelize.transaction();

    const user = await User.findByPk(id, { transaction });
    if (!user) throw createError({ statusCode: 404, message: 'User not found' });

    if (!body.services || !isArrayString(body.services)) {
      throw createError({
        statusCode: 400,
        message: 'Body param services can be passed and exist string array'
      });
    }

    const isServicesTrueHash = body.services.every((item) => !isNumeric(item));
    if (!isServicesTrueHash) {
      throw createError({
        statusCode: 400,
        message: 'Body param services must only string array'
      });
    }

    const services = await Service.findAll({
      where: {
        hash: body.services
      },
      transaction
    });
    if (!services.length) {
      throw createError({
        statusCode: 400,
        message: 'All services missed'
      });
    }

    await user.setServices(services, { transaction });

    await transaction.commit();
    return user;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
});
