import { createRouter } from 'h3';
import * as events from './events';

const router = createRouter();

router.post('/api/certificates/use', events.use);
router.post('/api/certificates/gen', events.gen);

export default router;
