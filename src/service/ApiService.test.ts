// import * as Flex from '@twilio/flex-ui';
// import ApiService from './ApiService';
// import { EncodedParams } from '../types/Params';

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => {
//       return { ok: true };
//     },
//   }),
// ) as jest.Mock;

// class Test extends ApiService {
//   testHasManagerClassMember(): boolean {
//     return this.manager !== undefined;
//   }
//   testBuildBody(encodedParams: EncodedParams): string {
//     return this.buildBody(encodedParams);
//   }
//   testFetchJSONWithReject<T>(url: string, config: RequestInit, attempts = 0): Promise<T> {
//     return this.fetchJsonWithReject(url, config, attempts);
//   }
// }

// describe('utils/common/ApiService', () => {
//   // beforeEach(() => {
//   //   fetch.mockClear();
//   // });

//   const TestService = new Test();

//   it('should provide access to the Flex Manager instance', () => {
//     expect(TestService.testHasManagerClassMember()).toBe(true);
//   });

//   it('should build encoded params into a string to use as the body for serverless reqeusts', () => {
//     const encodedParams: EncodedParams = {
//       testParam1: encodeURIComponent('testParam1ToBeEncoded'),
//       testParam2: encodeURIComponent('testParam2ToBeEncoded'),
//       testParamToDrop: undefined,
//     };

//     const body = TestService.testBuildBody(encodedParams);

//     expect(body).toBe('testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded');
//   });

//   // it('should fetch JSON successfully', async () => {
//   //   const encodedParams: EncodedParams = {
//   //     testParam1: encodeURIComponent('testParam1ToBeEncoded'),
//   //     testParam2: encodeURIComponent('testParam2ToBeEncoded'),
//   //     testParamToDrop: undefined,
//   //   };

//   //   const body = TestService.testBuildBody(encodedParams);

//   //   const mockConfig = {
//   //     method: 'POST',
//   //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   //     body,
//   //   };
//   //   const response = await TestService.testFetchJSONWithReject('mockURL', mockConfig);
//   //   console.log(JSON.stringify(response));
//   //   expect(response).toEqual({ ok: true });
//   // });
// });

import * as Flex from '@twilio/flex-ui';
import { EventEmitter } from 'events';
import { getMockedServiceConfiguration } from '../../test-utils/flex-service-configuration';
import ApiService from './ApiService';
import { EncodedParams } from '../types/Params';
// import { UIAttributes } from '../../../types/manager/ServiceConfiguration';

// NOTE: Make dummy class to extend ApiService because it's abstract
class WorkerClient extends EventEmitter {
  sid: string;
  attributes: object;
  reservations: object;
  constructor() {
    super();
    this.sid = 'mockWorkerSid';
    this.attributes = {};
    this.reservations = new Map();
  }
}
class Manager {
  events: EventEmitter;
  workerClient: WorkerClient;
  user: object;
  get serviceConfiguration() {
    return getMockedServiceConfiguration();
  }

  constructor() {
    this.events = new EventEmitter();
    this.workerClient = new WorkerClient();
    this.user = {
      token: 'mockedToken',
    };
  }
  getInstance() {
    return this;
  }
}
export const managerInstance = new Manager();
class Test extends ApiService {
  // NOTE: Make helper function to provide access to protected class members
  testHasManagerClassMember(): boolean {
    return this.manager !== undefined;
  }

  // NOTE: Make helper function to provide access to protected class members
  testBuildBody(encodedParams: EncodedParams): string {
    return this.buildBody(encodedParams);
  }
  async testFetchJsonWithReject(url: string, config: RequestInit): Promise<any> {
    try {
      return this.fetchJsonWithReject(url, config);
    } catch (e) {
      console.log('error custom', e);
      return Promise.resolve(e);
    }
  }
}
jest.mock('@twilio/flex-ui', () => {
  return {
    Manager: {
      getInstance: () => {
        return new Manager();
      },
    },
  };
});
// jest.mock('../../../utils/configuration', () => {
//   return {
//     getFeatureFlags: () => {
//       return {
//         custom_data: {
//           serverless_functions_domain: 'https://test-serverless-domain.io',
//         },
//       };
//     },
//   };
// });
describe('utils/common/ApiService', () => {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    FLEX_APP_SERVERLESS_FUNCTONS_DOMAIN: 'https://test-serverless-domain.io',
  };
  const TestService = new Test();
  Object.defineProperty(TestService, 'serverlessDomain', { get: () => 'https://jhvdghd.io' });

  afterAll(() => {
    process.env = originalEnv;
  });
  it('should provide access to the Flex Manager instance', () => {
    expect(TestService.testHasManagerClassMember()).toBe(true);
  });

  // it('should provide access to the configured serverless domain', () => {
  //   const { serviceConfiguration:{ui_attributes} } = Flex.Manager.getInstance();
  //   const { custom_data: {serverless_functions_domain} } = ui_attributes as UIAttributes;
  //   expect(TestService.serverlessDomain).toBe(serverless_functions_domain);
  // });

  it('should build encoded params into a string to use as the body for serverless reqeusts', () => {
    const encodedParams: EncodedParams = {
      testParam1: encodeURIComponent('testParam1ToBeEncoded'),
      testParam2: encodeURIComponent('testParam2ToBeEncoded'),
      testParamToDrop: undefined,
    };

    const body = TestService.testBuildBody(encodedParams);

    expect(body).toBe('testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded');
  });
  it('should call fetch json with reject success scenario', async () => {
    const mockResponse = { test: 100, ok: true };
    global.fetch = jest.fn(() => Promise.resolve({ ...mockResponse, json: () => mockResponse })) as jest.Mock;

    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded',
    } as unknown as RequestInit;
    const res = await TestService.testFetchJsonWithReject('test_url', config);
  });
  it('should call fetch json with reject failure scenario', async () => {
    const mockResponse = { test: 100 };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse)) as jest.Mock;

    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded',
    } as unknown as RequestInit;

    let err = null;
    try {
      await TestService.testFetchJsonWithReject('test_url', config);
    } catch (error) {
      err = error;
    }

    expect(err).toEqual(mockResponse);
  });
  // it('should call fetch json with reject promiseReject', async () => {
  //   const mockError = { status: 429 };
  //   global.fetch = jest.fn(() => Promise.reject({ ...mockError, json: () => Promise.resolve(mockError) })) as jest.Mock;

  //   const config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: 'testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded',
  //   } as unknown as RequestInit;
  //   let err = null;
  //   let res = null;
  //   try {
  //     res = await TestService.testFetchJsonWithReject('test_url', config);
  //   } catch (error) {
  //     err = error;
  //   }
  //   expect(err).toEqual({ ...mockError, json: () => Promise.resolve(mockError) });
  // });
});
