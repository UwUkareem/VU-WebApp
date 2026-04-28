import { datastore } from '../datastore';
import {
  getCandidateById,
  getCandidateBySlug,
  toSlug,
  getCandidatesByJob,
  getCandidatesByJobId,
} from '../database/candidates';

export const CANDIDATES = datastore.candidates;

export const candidatesApi = Object.freeze({
  list: () => datastore.candidates,
  getById: getCandidateById,
  getBySlug: getCandidateBySlug,
  slugify: toSlug,
  getByJob: getCandidatesByJob,
  getByJobId: getCandidatesByJobId,
});

export { getCandidateById, getCandidateBySlug, toSlug, getCandidatesByJob, getCandidatesByJobId };
