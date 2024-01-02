import { useModel, useSequelize } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const sequelize = useSequelize(event);
  const Certificate = useModel(event, 'Certificate');

  const body = await readBody<{ number: string; name: string; email: string; phone?: string }>(event);
  const { number: certificateNumber, ...userBody } = body || {};

  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (!certificateNumber) throw createError({ statusCode: 400, message: 'Certificate not provided' });

    const certificate = await Certificate.findOne({
      where: { number: certificateNumber },
      transaction
    });
    if (!certificate) throw createError({ statusCode: 404, message: 'Certificate not found' });

    if (certificate.userId) throw createError({ statusCode: 400, message: 'Certificate already used' });

    const newUser = await certificate.createUser(userBody, { transaction });

    await transaction.commit();
    return newUser;
  } catch (error: any) {
    if (transaction) await transaction.rollback();
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || undefined
    });
  }
});
