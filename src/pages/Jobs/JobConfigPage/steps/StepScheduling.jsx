import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { TextInput } from '../../../../components/ui/Input';
import { Toggle } from '../../../../components/ui/Toggle';
import { EMAIL_TRIGGERS } from '../../../../api';

export function StepScheduling({ form, updateField, updateEmail, statusPreview }) {
  const today = new Date().toISOString().split('T')[0];
  const handleStartDate = (v) => {
    updateField('startDate', v);
    if (form.endDate && v > form.endDate) updateField('endDate', '');
  };

  return (
    <>
      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Choose which automated emails to send to candidates"
        >
          Email Notifications
        </SectionTitle>
        <div className="create-job__mock-list">
          {EMAIL_TRIGGERS.map((t) => (
            <div key={t.id} className="create-job__trigger">
              <div className="create-job__trigger-info">
                <span className="create-job__trigger-title">{t.title}</span>
                <span className="create-job__trigger-desc">{t.desc}</span>
              </div>
              <Toggle
                checked={form.emails[t.id]}
                onChange={(checked) => updateEmail(t.id, checked)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Set the application window and candidate limits"
        >
          Scheduling
        </SectionTitle>
        <div className="create-job__row create-job__row--3">
          <TextInput
            label="Start Date"
            type="date"
            min={today}
            value={form.startDate}
            onChange={(e) => handleStartDate(e.target.value)}
            hint="Leave blank to start immediately"
          />
          <TextInput
            label="End Date"
            type="date"
            min={form.startDate || today}
            value={form.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            hint="Leave blank for no end date"
          />
          <TextInput
            label="Max Candidates"
            type="number"
            min="1"
            placeholder="e.g. 200"
            value={form.maxCandidates}
            onChange={(e) => updateField('maxCandidates', e.target.value)}
            hint="Limit applications accepted"
          />
        </div>
        <div className="create-job__status-preview">
          <span className="create-job__status-preview-title">Status Preview</span>
          {statusPreview.map((line, i) => (
            <div key={i} className="create-job__status-row">
              <span className={`create-job__status-dot create-job__status-dot--${line.color}`} />
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
