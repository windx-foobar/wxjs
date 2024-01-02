import { defineEventHandler, createError, getRouterParam } from 'h3';
import { useModel } from '../../../src';

export const index = defineEventHandler(async (event) => {
  const Service = useModel(event, 'Service');
  const services = await Service.findAll();

  return services;
});

export const showByHash = defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash');
  const Service = useModel(event, 'Service');

  if (!hash) throw createError({ statusCode: 500, statusMessage: 'Server error' });

  const service = await Service.findByHash(hash, {
    include: [{ association: 'users', through: { attributes: [] } }]
  });

  if (!service) throw createError({ statusMessage: 'Service not found', statusCode: 404 });

  return service;
});
