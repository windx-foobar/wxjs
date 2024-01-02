import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const Service = useModel(event, 'Service');
  const services = await Service.findAll();

  return services;
});
