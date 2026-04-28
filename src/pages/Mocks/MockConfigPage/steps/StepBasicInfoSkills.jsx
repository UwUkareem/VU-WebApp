import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { TextInput, DropdownInput, Textarea } from '../../../../components/ui/Input';
import { Tags } from '../../../../components/ui/Tags';
import { MOCK_TYPE_OPTIONS, DIFFICULTY_OPTIONS, DURATION_OPTIONS } from '../../../../api';

export function StepBasicInfoSkills({ form, updateField, addSkill, removeSkill, isActive }) {
  return (
    <>
      <section className="create-mock__section">
        <SectionTitle
          variant="inline"
          description="Define the core details for this evaluation module"
        >
          Basic Information
        </SectionTitle>
        <TextInput
          label="Mock Name"
          placeholder="e.g. System Design Interview"
          required
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          disabled={isActive}
        />
        <div className="create-mock__row create-mock__row--3">
          <DropdownInput
            label="Type"
            placeholder="Select type"
            required
            options={MOCK_TYPE_OPTIONS}
            value={form.type}
            onChange={(v) => updateField('type', v)}
            disabled={isActive}
          />
          <DropdownInput
            label="Difficulty"
            placeholder="Select difficulty"
            required
            options={DIFFICULTY_OPTIONS}
            value={form.difficulty}
            onChange={(v) => updateField('difficulty', v)}
            disabled={isActive}
          />
          <DropdownInput
            label="Estimated Duration"
            placeholder="Select duration"
            required
            options={DURATION_OPTIONS}
            value={form.durationMin}
            onChange={(v) => updateField('durationMin', v)}
            disabled={isActive}
          />
        </div>
        <Textarea
          label="Short Description"
          placeholder="Briefly describe what this mock evaluates..."
          rows={3}
          maxLength={500}
          showCounter
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </section>

      <section className="create-mock__section">
        <SectionTitle
          variant="inline"
          description="Add skills this mock evaluates. Used for CV analysis, skill alignment scoring, and search/filter."
        >
          Skills Covered
        </SectionTitle>
        <Tags
          tags={form.skills}
          variant="editable"
          showTitle={false}
          onAdd={addSkill}
          onRemove={isActive ? undefined : removeSkill}
        />
        {form.skills.length === 0 && (
          <p className="create-mock__hint">
            Add at least one skill to continue. Type and press Enter.
          </p>
        )}
      </section>
    </>
  );
}
