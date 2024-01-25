import { defineEventHandler, createError, getRouterParam, readBody } from 'h3';
import { isNumeric, isArrayString } from '@wxjs/shared';
import { useModel, useSequelize, useTransaction } from '../../../src';

export const index = defineEventHandler(async (event) => {
  const User = useModel(event, 'User');
  const users = await User.findAll();

  return users;
});

export const create = defineEventHandler(async () => {
  throw createError({
    statusCode: 400,
    statusMessage: 'Create new user allow only via certificate'
  });
});

export const show = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const User = useModel(event, 'User');

  if (!id) throw createError({ statusCode: 500, statusMessage: 'Server error' });

  const user = await User.findByPk(id, {
    include: [
      { association: 'certificate', attributes: { exclude: ['userId'] } },
      { association: 'services', through: { attributes: [] } },
      { association: 'posts', attributes: { exclude: ['userId'] } }
    ]
  });

  if (!user) throw createError({ statusMessage: 'User not found', statusCode: 404 });

  return user;
});

export const remove = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const User = useModel(event, 'User');

  if (!id) throw createError({ statusCode: 500, statusMessage: 'Server error' });

  return useTransaction(event, async (transaction) => {
    const user = await User.findByPk(id, { transaction });
    if (!user) throw createError({ statusMessage: 'User not found', statusCode: 404 });

    await user.destroy({ transaction });

    return user;
  });
});

export const createPost = defineEventHandler(async (event) => {
  const body = await readBody<{ title: string; introtext?: string }>(event);
  const id = getRouterParam(event, 'id');
  const sequelize = useSequelize(event);
  const User = useModel(event, 'User');

  if (!id) throw createError({ statusCode: 500, statusMessage: 'Server error' });

  let transaction;
  try {
    transaction = await sequelize.transaction();

    const user = await User.findByPk(id, { transaction });
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' });

    const newPost = await user.createPost(body, { transaction });

    await transaction.commit();
    return newPost;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
});

export const setServices = defineEventHandler(async (event) => {
  const body: { services?: string[] } = await readBody(event);
  const id = getRouterParam(event, 'id');
  const sequelize = useSequelize(event);
  const User = useModel(event, 'User');
  const Service = useModel(event, 'Service');

  if (!id) throw createError({ statusCode: 500, statusMessage: 'Server error' });

  let transaction;
  try {
    transaction = await sequelize.transaction();

    const user = await User.findByPk(id, { transaction });
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' });

    if (!body.services || !isArrayString(body.services)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Body param services can be passed and exist string array'
      });
    }

    const isServicesTrueHash = body.services.every((item) => !isNumeric(item));
    if (!isServicesTrueHash) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Body param services must only string array'
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
        statusMessage: 'All services missed'
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
