import { JobConfigForm } from '../JobConfigForm';
import { addJob } from '../../../../api';

/**
 * Convert the create-form shape into the shared-data job shape.
 */
function formToJob(form, status) {
  return {
    title: form.title,
    department: form.department.charAt(0).toUpperCase() + form.department.slice(1),
    seniority: form.seniority.charAt(0).toUpperCase() + form.seniority.slice(1),
    jobType: form.jobType
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    status,
    location: form.location || 'Remote',
    locationType: form.locationType
      ? form.locationType
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : 'Remote',
    description: form.description,
    duration: '0d 0h',
    publishDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    endDate: form.endDate || '',
    maxCandidates: form.maxCandidates ? Number(form.maxCandidates) : null,
    skills: [...form.skills],
    mocks: form.mocks.map((m, i) => ({
      id: m.id || `m${i + 1}`,
      name: m.name,
      weight: m.weight,
      duration: m.duration || `${m.durationMin} min`,
      durationMin: m.durationMin || 0,
      avgScore: 0,
      passRate: 0,
    })),
  };
}

/**
 * CreateConfig — thin wrapper that renders JobConfigForm in create mode.
 * On publish / save-draft, the job is stored in the shared data file.
 */
export function CreateConfig({ onCreated }) {
  const handlePublish = (form) => {
    const job = addJob(formToJob(form, 'active'));
    console.log('[CreateJob] published:', job);
    onCreated?.(job.id);
  };

  const handleSaveDraft = (form) => {
    const job = addJob(formToJob(form, 'draft'));
    console.log('[CreateJob] saved as draft:', job);
    onCreated?.(job.id);
  };

  return <JobConfigForm mode="create" onPublish={handlePublish} onSaveDraft={handleSaveDraft} />;
}
