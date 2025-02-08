import { registerPlugin } from '@capacitor/core';

import type { PaytermPlugin } from './definitions';

const Payterm = registerPlugin<PaytermPlugin>('Payterm', {
  web: () => import('./web').then(m => new m.PaytermWeb()),
});

export * from './definitions';
export { Payterm };
