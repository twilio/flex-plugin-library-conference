import 'regenerator-runtime/runtime';
import fetch from 'jest-fetch-mock';
import helpers from './serverless-test/test-utils/test-helper';
import { resetReduxState } from './test-utils/flex-redux';
import { resetServiceConfiguration } from './test-utils/flex-service-configuration';

//configure({ adapter: new Adapter() });

// Global test lifecycle handlers
beforeAll(() => {
  fetch.enableMocks();
  helpers.setup();
  Runtime._addFunction(
    'common/twilio-wrappers/retry-handler',
    './serverless/src/functions/twilio-wrappers/retry-handler.private.js',
  );
});

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(() => {
  // resetServiceConfiguration();
  resetReduxState();
});
