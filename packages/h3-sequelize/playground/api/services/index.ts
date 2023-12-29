import { createRouter } from 'h3';
import * as events from './events';

const router = createRouter();

router.get('/api/services', events.index);
router.get('/api/services/:hash/by-hash', events.showByHash);

export default router;
