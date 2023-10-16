import { setupWorker } from 'msw';
import { handlers } from './handlers';

console.info('Mocking API requests...');
export const worker = setupWorker(...handlers);
