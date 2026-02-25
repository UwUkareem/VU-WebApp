import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { InfoCard } from '../../../../components/ui/Cards';
import './CVAnalysis.css';

/* ── Data ── */

const JOB_MATCH = { fitScore: 88 };

const MATCH_VERDICT =
  JOB_MATCH.fitScore >= 80
    ? { label: 'Strong Match', variant: 'strong' }
    : JOB_MATCH.fitScore >= 60
      ? { label: 'Partial Match', variant: 'partial' }
      : { label: 'Weak Match', variant: 'weak' };

const EXPERIENCE = [
  {
    id: 1,
    title: 'Senior Software Engineer @ TechCorp',
    description: '2021 – Present · 3 years',
  },
  {
    id: 2,
    title: 'Software Engineer @ StartupXYZ',
    description: '2018 – 2021 · 3 years',
  },
  {
    id: 3,
    title: 'Junior Developer @ AgencyPro',
    description: '2016 – 2018 · 2 years',
  },
];

const SKILLS = [
  { label: 'Kubernetes', match: 'strong' },
  { label: 'AWS', match: 'strong' },
  { label: 'Node.js', match: 'strong' },
  { label: 'PostgreSQL', match: 'strong' },
  { label: 'React', match: 'bonus' },
  { label: 'TypeScript', match: 'bonus' },
  { label: 'GraphQL', match: 'bonus' },
  { label: 'Docker', match: 'missing' },
  { label: 'Terraform', match: 'missing' },
];

const GAP_ANALYSIS = {
  strengths: [
    {
      id: 1,
      title: 'Backend Architecture',
      description:
        'Strong experience designing scalable microservice systems with event-driven patterns.',
    },
    {
      id: 2,
      title: 'Cloud Infrastructure',
      description:
        'Deep AWS expertise including ECS, Lambda, and S3 with production-grade deployments.',
    },
    {
      id: 3,
      title: 'Team Leadership',
      description: 'Led a team of 5 engineers, ran sprint planning and code reviews.',
    },
  ],
  gaps: [
    {
      id: 1,
      title: 'Containerisation',
      description: 'No demonstrated Docker or container orchestration experience on the CV.',
    },
    {
      id: 2,
      title: 'IaC Tooling',
      description:
        'Missing Terraform or CloudFormation skills for infrastructure-as-code workflows.',
    },
  ],
};

const FULL_CV_TEXT = `Summary
Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and cloud-native systems. Proven track record in backend architecture, API design, and team leadership.

Experience
Senior Software Engineer — TechCorp (2021 – Present)
• Architected and shipped a real-time analytics pipeline handling 50M events/day
• Led migration from monolith to microservices, reducing deploy times by 70%
• Mentored 3 junior engineers through structured pairing and code reviews

Software Engineer — StartupXYZ (2018 – 2021)
• Built RESTful APIs serving 200k daily active users
• Designed PostgreSQL schema supporting multi-tenant SaaS platform
• Implemented CI/CD pipeline with GitHub Actions and AWS CodeDeploy

Junior Developer — AgencyPro (2016 – 2018)
• Developed client-facing web apps using React and Node.js
• Collaborated with designers to translate Figma mockups into production UI

Education
B.Sc. Computer Science — Cairo University (2016)

Certifications
AWS Certified Solutions Architect – Associate
`;

/* ── Component ── */

export const CVAnalysis = memo(function CVAnalysis() {
  const [cvExpanded, setCvExpanded] = useState(false);

  const toggleCv = useCallback(() => setCvExpanded((p) => !p), []);

  return (
    <div className="cv-analysis">
      {/* 1 — Job Match Overview */}
      <div className="cv-analysis__section">
        <div className="cv-analysis__match-card">
          <span className="cv-analysis__match-title">Role Fit Score</span>
          <div className="cv-analysis__match-score-block">
            <span className="cv-analysis__match-number">{JOB_MATCH.fitScore}%</span>
            <span
              className={`cv-analysis__match-verdict cv-analysis__match-verdict--${MATCH_VERDICT.variant}`}
            >
              {MATCH_VERDICT.label}
            </span>
          </div>
          <div className="cv-analysis__match-bar-track">
            <div
              className="cv-analysis__match-bar-fill"
              style={{ width: `${JOB_MATCH.fitScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2 — Extracted Skills */}
      <div className="cv-analysis__section">
        <SectionTitle>Extracted Skills</SectionTitle>
        <div className="cv-analysis__skills">
          {SKILLS.map((skill) => (
            <span
              key={skill.label}
              className={`cv-analysis__skill-tag cv-analysis__skill-tag--${skill.match}`}
              title={
                skill.match === 'strong'
                  ? 'Strong Match'
                  : skill.match === 'bonus'
                    ? 'Bonus Skill'
                    : 'Missing Skill'
              }
            >
              {skill.label}
            </span>
          ))}
        </div>
      </div>

      {/* 3 — Experience Summary */}
      <div className="cv-analysis__section">
        <SectionTitle>Experience Summary</SectionTitle>
        <div className="cv-analysis__experience">
          {EXPERIENCE.map((exp) => (
            <InfoCard key={exp.id} title={exp.title} description={exp.description} animated />
          ))}
        </div>
      </div>

      {/* 4 — Gap Analysis */}
      <div className="cv-analysis__section">
        <SectionTitle>Gap Analysis</SectionTitle>
        <div className="cv-analysis__gap-grid">
          <div className="cv-analysis__gap-col">
            <h4 className="cv-analysis__gap-heading cv-analysis__gap-heading--strengths">
              Strengths
            </h4>
            <div className="cv-analysis__gap-list">
              {GAP_ANALYSIS.strengths.map((item) => (
                <InfoCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  animated
                />
              ))}
            </div>
          </div>
          <div className="cv-analysis__gap-col">
            <h4 className="cv-analysis__gap-heading cv-analysis__gap-heading--gaps">Gaps</h4>
            <div className="cv-analysis__gap-list">
              {GAP_ANALYSIS.gaps.map((item) => (
                <InfoCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  animated
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5 — Full CV */}
      <div className="cv-analysis__section">
        <button type="button" className="cv-analysis__cv-toggle" onClick={toggleCv}>
          <SectionTitle>Full CV</SectionTitle>
          <ChevronDown
            size={20}
            className={['cv-analysis__cv-chevron', cvExpanded && 'cv-analysis__cv-chevron--open']
              .filter(Boolean)
              .join(' ')}
          />
        </button>

        <div
          className={['cv-analysis__cv-content', cvExpanded && 'cv-analysis__cv-content--open']
            .filter(Boolean)
            .join(' ')}
        >
          <div className="cv-analysis__cv-inner">
            <pre className="cv-analysis__cv-text">{FULL_CV_TEXT}</pre>
          </div>
        </div>
      </div>
    </div>
  );
});

CVAnalysis.propTypes = {
  candidate: PropTypes.object,
};
