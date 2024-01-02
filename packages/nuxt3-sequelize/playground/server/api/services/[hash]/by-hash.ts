import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash');
  const Service = useModel(event, 'Service');

  if (!hash) throw createError({ statusCode: 500, message: 'Server error' });

  const service = await Service.findByHash(hash, {
    include: [{ association: 'users', through: { attributes: [] } }]
  });

  if (!service) throw createError({ message: 'Service not found', statusCode: 404 });

  return service;
});
