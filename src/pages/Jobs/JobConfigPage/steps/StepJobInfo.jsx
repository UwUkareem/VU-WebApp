import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { TextInput, DropdownInput, Textarea } from '../../../../components/ui/Input';
import { Tags } from '../../../../components/ui/Tags';
import {
  JOB_TYPE_OPTIONS,
  SENIORITY_OPTIONS,
  LOCATION_TYPE_OPTIONS,
} from '../../../../data/config';

export function StepJobInfo({ form, updateField, departmentOptions, addSkill, removeSkill }) {
  return (
    <>
      <section className="create-job__section">
        <SectionTitle variant="inline" description="Enter the core details for this job posting">
          Basic Information
        </SectionTitle>
        <TextInput
          label="Job Title"
          placeholder="e.g. Senior Software Engineer"
          required
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
        <div className="create-job__row create-job__row--3">
          <DropdownInput
            label="Department"
            placeholder="Select department"
            required
            options={departmentOptions}
            value={form.department}
            onChange={(v) => updateField('department', v)}
          />
          <DropdownInput
            label="Job Type"
            placeholder="Select type"
            required
            options={JOB_TYPE_OPTIONS}
            value={form.jobType}
            onChange={(v) => updateField('jobType', v)}
          />
          <DropdownInput
            label="Seniority Level"
            placeholder="Select level"
            required
            options={SENIORITY_OPTIONS}
            value={form.seniority}
            onChange={(v) => updateField('seniority', v)}
          />
        </div>
      </section>

      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Add the skills and technologies candidates should have"
        >
          Skills & Requirements
        </SectionTitle>
        <Tags
          tags={form.skills}
          variant="editable"
          showTitle={false}
          onAdd={addSkill}
          onRemove={removeSkill}
        />
      </section>

      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Describe the role, responsibilities, and expectations"
        >
          Job Description
        </SectionTitle>
        <Textarea
          label="Description"
          showLabel={false}
          placeholder="Describe the role, responsibilities, and what a typical day looks like..."
          rows={5}
          maxLength={2000}
          showCounter
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </section>

      <section className="create-job__section">
        <SectionTitle variant="inline" description="Where will this role be based?">
          Location
        </SectionTitle>
        <div className="create-job__row create-job__row--2">
          <DropdownInput
            label="Work Arrangement"
            placeholder="Select arrangement"
            options={LOCATION_TYPE_OPTIONS}
            value={form.locationType}
            onChange={(v) => updateField('locationType', v)}
          />
          <TextInput
            label="City / Country"
            placeholder="e.g. San Francisco, CA"
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>
      </section>
    </>
  );
}
