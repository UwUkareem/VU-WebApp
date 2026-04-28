import { datastore } from '../datastore';
import { getJobById, updateJob, addJob, removeJob, duplicateJob } from '../database/jobs';

export const JOBS = datastore.jobs;

export const jobsApi = Object.freeze({
  list: () => datastore.jobs,
  getById: getJobById,
  update: updateJob,
  create: addJob,
  remove: removeJob,
  duplicate: duplicateJob,
});

export { getJobById, updateJob, addJob, removeJob, duplicateJob };
