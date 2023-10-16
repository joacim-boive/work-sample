// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/Hero.spec.js
// learn more: https://github.com/testing-library/jest-dom
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { server } from './src/mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
