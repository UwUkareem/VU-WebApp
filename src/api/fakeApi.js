import { datastore, getDatastoreSnapshot } from './datastore';
import {
  jobsApi,
  mocksApi,
  candidatesApi,
  companyApi,
  applicationApi,
  configApi,
} from './resources';
import { DEFAULT_FAKE_API_LATENCY_MS, withLatency } from './utils/latency';

function wrapResourceWithLatency(resource, latencyMs = DEFAULT_FAKE_API_LATENCY_MS) {
  const wrapped = {};

  Object.entries(resource).forEach(([key, value]) => {
    if (typeof value === 'function') {
      wrapped[key] = (...args) => withLatency(() => value(...args), latencyMs);
      return;
    }

    wrapped[key] = value;
  });

  return Object.freeze(wrapped);
}

export const localApi = Object.freeze({
  jobs: jobsApi,
  mocks: mocksApi,
  candidates: candidatesApi,
  company: companyApi,
  application: applicationApi,
  config: configApi,
  datastore,
});

export const fakeApi = Object.freeze({
  jobs: wrapResourceWithLatency(jobsApi),
  mocks: wrapResourceWithLatency(mocksApi),
  candidates: wrapResourceWithLatency(candidatesApi),
  company: wrapResourceWithLatency(companyApi),
  application: wrapResourceWithLatency(applicationApi),
  config: wrapResourceWithLatency(configApi),
  datastore: Object.freeze({
    snapshot: () => withLatency(() => getDatastoreSnapshot()),
  }),
});

export const fakeApiMeta = Object.freeze({
  latencyMs: DEFAULT_FAKE_API_LATENCY_MS,
  mode: 'in-memory',
});

export * from './resources';
export { datastore, getDatastoreSnapshot, DEFAULT_FAKE_API_LATENCY_MS };
