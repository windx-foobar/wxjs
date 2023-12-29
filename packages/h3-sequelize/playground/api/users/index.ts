import { createRouter, eventHandler, createError } from 'h3';
import { useModel } from '../../../src';

const router = createRouter();

router.get('/api/users', eventHandler(async (event) => {
  const User = useModel(event, 'User');

  const userRows = await User.findAll();
  return userRows;
}));

export default router;
