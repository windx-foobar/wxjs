import { createRouter } from 'h3';
import * as events from './events';

const router = createRouter();

router.get('/api/users', events.index);
router.post('/api/users', events.create);
router.get('/api/users/:id', events.show);
router.delete('/api/users/:id', events.remove);
router.post('/api/users/:id/posts', events.createPost);
router.post('/api/users/:id/services/set', events.setServices);

export default router;
