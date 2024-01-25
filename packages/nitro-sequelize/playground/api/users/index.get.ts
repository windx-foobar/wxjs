import { useModel } from '#wxjs/sequelize';

export default defineEventHandler(async (event) => {
  const User = useModel(event, 'User');
  const users = await User.findAll();

  return users;
});
