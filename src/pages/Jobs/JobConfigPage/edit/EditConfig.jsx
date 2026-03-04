import { useMemo } from 'react';
import { JobConfigForm } from '../JobConfigForm';
import { getJobById, updateJob } from '../../JobManagement/_shared/jobData';

/**
 * Convert a shared-data job object into the form shape expected by JobConfigForm.
 */
function jobToForm(job) {
  return {
    title: job.title,
    department: job.department.toLowerCase(),
    jobType: job.jobType.toLowerCase().replace(/\s/g, '-'),
    seniority: job.seniority.toLowerCase(),
    description: job.description,
    skills: [...job.skills],
    locationType: job.locationType.toLowerCase().replace(/\s/g, '-'),
    location: job.location,
    mocks: job.mocks.map((m) => ({
      id: m.id,
      name: m.name,
      type: 'Technical',
      difficulty: 'Medium',
      duration: m.duration,
      durationMin: m.durationMin,
      skills: [],
      weight: m.weight,
    })),
    emails: { 'on-apply': true, 'on-shortlist': true, 'on-reject': true },
    startDate: '',
    endDate: job.endDate || '',
    maxCandidates: job.maxCandidates ? String(job.maxCandidates) : '',
  };
}

/**
 * EditConfig — renders JobConfigForm in edit mode with pre-filled data
 * pulled from the shared job data store.
 */
export function EditConfig({ jobId }) {
  const job = getJobById(jobId);
  const formData = useMemo(() => (job ? jobToForm(job) : null), [job]);

  const handleSaveChanges = (form) => {
    if (!job) return;
    updateJob(job.id, {
      title: form.title,
      department: form.department.charAt(0).toUpperCase() + form.department.slice(1),
      seniority: form.seniority.charAt(0).toUpperCase() + form.seniority.slice(1),
      jobType: form.jobType
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      description: form.description,
      skills: [...form.skills],
      locationType: form.locationType
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      location: form.location,
      mocks: form.mocks.map((m) => ({
        ...m,
        avgScore: job.mocks.find((om) => om.id === m.id)?.avgScore ?? 0,
        passRate: job.mocks.find((om) => om.id === m.id)?.passRate ?? 0,
      })),
      endDate: form.endDate || job.endDate,
      maxCandidates: form.maxCandidates ? Number(form.maxCandidates) : job.maxCandidates,
    });
    console.log('[EditJob] saved:', form);
  };

  const handleStatusChange = (newStatus) => {
    if (!job) return;
    updateJob(job.id, { status: newStatus });
    console.log('[EditJob] status →', newStatus);
  };

  if (!formData) {
    return (
      <div style={{ padding: 'var(--padding-lg)', color: 'var(--text-tertiary)' }}>
        Job not found.
      </div>
    );
  }

  return (
    <JobConfigForm
      mode="edit"
      initialData={formData}
      status={job.status}
      candidateCount={job.totalApplied}
      onSaveChanges={handleSaveChanges}
      onStatusChange={handleStatusChange}
    />
  );
}
