import { createRouter } from 'h3';
import * as events from './events';

const router = createRouter();

router.get('/api/posts', events.index);
router.get('/api/posts/:id', events.show);

export default router;
