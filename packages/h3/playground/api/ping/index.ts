import { createRouter, eventHandler } from 'h3';

const router = createRouter();

router.get('/ping', eventHandler((event) => {
  return { message: 'pong' };
}));

export default router;
