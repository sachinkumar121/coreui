import { WebPlugin } from '@capacitor/core';

import type { PaytermPlugin } from './definitions';

export class PaytermWeb extends WebPlugin implements PaytermPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO2', options);
    return options;
  }
}
