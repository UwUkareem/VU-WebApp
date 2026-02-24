import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Briefcase,
  Star,
  CalendarDays,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  ChevronRight,
} from 'lucide-react';
import { EntityCard, InfoCard, ActionCard } from '../../../components/ui/Cards';
import { Tabs } from '../../../components/ui/Tabs';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { RadarChart } from '../../../components/ui/Charts';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import './CandidateDetails.css';

// Score icon used in description meta
const SCORE_ICON = <Star size={16} fill="var(--brand-600)" stroke="var(--brand-600)" />;

// Cheating flag icon map
const CHEAT_ICON_MAP = {
  clean: ShieldCheck,
  flagged: ShieldAlert,
  critical: ShieldX,
};

const CHEAT_COLOR_MAP = {
  clean: 'var(--green-500)',
  flagged: 'var(--yellow-500)',
  critical: 'var(--red-500)',
};

const CHEAT_LABEL_MAP = {
  clean: 'No Cheating Detected',
  flagged: 'Suspicious Activity Flagged',
  critical: 'Critical: Cheating Detected',
};

const CHEAT_DESC_MAP = {
  clean:
    "The anti-cheat system did not detect any suspicious behavior during this candidate's mock sessions. All responses appear authentic and consistent.",
  flagged:
    "Minor anomalies were detected in the candidate's session — such as tab-switching or unusual timing patterns. A manual review is recommended.",
  critical:
    'Multiple high-confidence cheating indicators were found, including copy-paste patterns, external resource access, and response timing inconsistencies.',
};

// ---------- Mock data generators ----------

function buildSkillDistribution(score) {
  const base = score;
  return [
    { label: 'Problem Solving', value: Math.min(100, base + 4) },
    { label: 'Communication', value: Math.min(100, base - 2) },
    { label: 'Technical Knowledge', value: Math.min(100, base + 1) },
    { label: 'Code Quality', value: Math.min(100, base - 5) },
  ];
}

function buildAIInsights(candidate) {
  return [
    {
      title: 'Strongest Area',
      description: `${candidate.name} excels in problem solving with structured, logical approaches. Their solutions demonstrate strong analytical thinking and attention to edge cases.`,
    },
    {
      title: 'Improvement Needed',
      description: `Communication clarity could be improved — responses tend to be technically accurate but lack concise explanations that non-technical stakeholders could follow.`,
    },
    {
      title: 'Overall Assessment',
      description: `With a score of ${candidate.score}%, ${candidate.name} is a ${candidate.score >= 85 ? 'strong' : candidate.score >= 70 ? 'solid' : 'developing'} candidate for the ${candidate.job} position. ${candidate.score >= 85 ? 'Highly recommended for next stage.' : 'May benefit from further evaluation.'}`,
    },
  ];
}

function buildQuestionReview(candidate) {
  const questions = [
    {
      title: 'System Design: URL Shortener',
      subtitle: 'Design a scalable URL shortening service similar to bit.ly',
      score: Math.min(100, candidate.score + 3),
      feedback:
        'Strong understanding of distributed systems. Proposed a well-structured design with proper caching layers and database partitioning. Could improve on discussing trade-offs more explicitly.',
    },
    {
      title: 'Algorithm: Binary Tree Traversal',
      subtitle: 'Implement in-order, pre-order, and post-order traversals',
      score: Math.min(100, candidate.score - 2),
      feedback:
        'Correctly implemented all three traversal methods with clean, readable code. Time complexity analysis was accurate. Recursive solutions were well-structured.',
    },
    {
      title: 'Behavioral: Team Conflict Resolution',
      subtitle: 'Describe a time you resolved a disagreement within your team',
      score: Math.min(100, candidate.score + 6),
      feedback:
        'Provided a compelling real-world example with clear context, actions taken, and measurable outcomes. Demonstrated strong leadership and empathy.',
    },
    {
      title: 'Coding: REST API Implementation',
      subtitle: 'Build a RESTful API for a task management app',
      score: Math.min(100, candidate.score - 8),
      feedback:
        'Functional implementation with proper HTTP methods and status codes. Error handling was minimal — could benefit from input validation and more comprehensive error responses.',
    },
  ];
  return questions;
}

function buildCompletedMocks(candidate) {
  return [
    {
      title: 'Technical Mock Interview',
      subtitle: 'Completed Feb 5, 2025 • 45 min',
      score: candidate.score,
    },
    {
      title: 'System Design Session',
      subtitle: 'Completed Feb 3, 2025 • 60 min',
      score: Math.min(100, candidate.score - 4),
    },
    {
      title: 'Behavioral Assessment',
      subtitle: 'Completed Jan 30, 2025 • 30 min',
      score: Math.min(100, candidate.score + 5),
    },
  ];
}

// Skill distribution chart colors
const SKILL_COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];

// ---------- Component ----------

export function CandidateDetails({ candidate }) {
  const [activeTab, setActiveTab] = useState('feedback');

  // Memoize derived data
  const skillDistribution = useMemo(
    () => buildSkillDistribution(candidate.score),
    [candidate.score]
  );
  const aiInsights = useMemo(() => buildAIInsights(candidate), [candidate]);
  const questionReview = useMemo(() => buildQuestionReview(candidate), [candidate]);
  const completedMocks = useMemo(() => buildCompletedMocks(candidate), [candidate]);

  const CheatIcon = CHEAT_ICON_MAP[candidate.antiCheat] || ShieldCheck;

  const tabs = [
    {
      label: 'Full Feedback',
      isActive: activeTab === 'feedback',
      onClick: () => setActiveTab('feedback'),
    },
    {
      label: 'Mock Replay',
      isActive: activeTab === 'replay',
      onClick: () => setActiveTab('replay'),
    },
    {
      label: 'CV Analysis',
      isActive: activeTab === 'cv',
      onClick: () => setActiveTab('cv'),
    },
  ];

  return (
    <div className="candidate-details">
      {/* Two-column layout */}
      <div className="candidate-details__layout">
        {/* -------- Left Column -------- */}
        <div className="candidate-details__left">
          {/* Entity Card - Sticky */}
          <EntityCard
            userName={candidate.name}
            userEmail={`${candidate.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}
            showBadge
            badgeType="candidateState"
            badgeVariant={candidate.status}
            colLeft={{ icon: Briefcase, title: candidate.job, subtitle: 'Position' }}
            colMid={{ icon: Star, title: `${candidate.score}%`, subtitle: 'Overall Score' }}
            colRight={{ icon: CalendarDays, title: candidate.date, subtitle: 'Applied' }}
            className="candidate-details__entity-card"
          />

          {/* Tabs and Content Container */}
          <div className="candidate-details__tabs-container">
            {/* Tabs */}
            <Tabs items={tabs} className="candidate-details__tabs" />

            {/* Tab Content - Scrollable */}
            <div className="candidate-details__tab-content-wrapper">
              {activeTab === 'feedback' && (
                <div className="candidate-details__tab-content">
                  {/* Skill Distribution - Primary Section */}
                  <div className="candidate-details__primary-section">
                    <RadarChart
                      title="Skill Distribution"
                      stats={skillDistribution}
                      colors={SKILL_COLORS}
                      animated
                    />
                  </div>

                  {/* AI Insights */}
                  <div className="candidate-details__section">
                    <SectionTitle>AI Insights</SectionTitle>
                    <div className="candidate-details__insights-grid">
                      {aiInsights.map((insight, i) => (
                        <InfoCard
                          key={i}
                          title={insight.title}
                          description={insight.description}
                          animated
                        />
                      ))}
                    </div>
                  </div>

                  {/* Cheating Detection */}
                  <div className="candidate-details__section">
                    <SectionTitle>Cheating Detection</SectionTitle>
                    <div className="candidate-details__cheat-card">
                      <div className="candidate-details__cheat-header">
                        <CheatIcon
                          size={20}
                          style={{ color: CHEAT_COLOR_MAP[candidate.antiCheat] }}
                        />
                        <span className="candidate-details__cheat-label">
                          {CHEAT_LABEL_MAP[candidate.antiCheat]}
                        </span>
                        <Badge type="cheatingFlag" variant={candidate.antiCheat} iconLeft />
                      </div>
                      <p className="candidate-details__cheat-desc">
                        {CHEAT_DESC_MAP[candidate.antiCheat]}
                      </p>
                    </div>
                  </div>

                  {/* Question-by-Question Review */}
                  <div className="candidate-details__section">
                    <SectionTitle>Question-by-Question Review</SectionTitle>
                    <div className="candidate-details__questions">
                      {questionReview.map((q, i) => (
                        <ActionCard
                          key={i}
                          title={q.title}
                          subtitle={q.subtitle}
                          descriptionTitle="Score"
                          showDescriptionIcon
                          descriptionNumber={`${q.score}%`}
                          content={q.feedback}
                          animated
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'replay' && (
                <div className="candidate-details__tab-content candidate-details__tab-placeholder">
                  <div className="candidate-details__placeholder-icon">▶</div>
                  <p>Mock replay will be available here.</p>
                  <span>
                    Watch the recorded mock interview sessions with timestamped annotations.
                  </span>
                </div>
              )}

              {activeTab === 'cv' && (
                <div className="candidate-details__tab-content candidate-details__tab-placeholder">
                  <div className="candidate-details__placeholder-icon">📄</div>
                  <p>CV analysis will be available here.</p>
                  <span>AI-powered resume parsing and skill extraction insights.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* -------- Right Column -------- */}
        <div className="candidate-details__right">
          {/* Quick Score Summary - Top */}
          <div className="candidate-details__score-summary">
            <div className="candidate-details__score-ring">
              <svg viewBox="0 0 120 120" className="candidate-details__score-svg">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={
                    candidate.score >= 85
                      ? '#22c55e'
                      : candidate.score >= 70
                        ? '#3b82f6'
                        : candidate.score >= 50
                          ? '#eab308'
                          : '#ef4444'
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(candidate.score / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                  transform="rotate(-90 60 60)"
                  className="candidate-details__score-progress"
                />
              </svg>
              <div className="candidate-details__score-value">
                <span className="candidate-details__score-number">{candidate.score}</span>
                <span className="candidate-details__score-percent">%</span>
              </div>
            </div>
            <span className="candidate-details__score-label">Overall Score</span>
          </div>

          {/* Completed Mocks - Middle */}
          <div className="candidate-details__mocks-container">
            <h3 className="candidate-details__sidebar-title">Completed Mocks</h3>
            <div className="candidate-details__mocks-list">
              {completedMocks.map((mock, i) => (
                <ActionCard
                  key={i}
                  title={mock.title}
                  subtitle={mock.subtitle}
                  descriptionTitle="Score"
                  showDescriptionIcon
                  descriptionNumber={`${mock.score}%`}
                  animated
                  className="candidate-details__mock-card"
                />
              ))}
            </div>
          </div>

          {/* Decision Buttons - Bottom */}
          <div className="candidate-details__decisions">
            <h3 className="candidate-details__sidebar-title">Select decision</h3>
            <div className="candidate-details__decision-buttons">
              <Button
                variant="primary"
                className="candidate-details__btn candidate-details__btn--accept"
                onClick={() => console.log('Accept', candidate.name)}
              >
                Accept
              </Button>
              <Button
                variant="primary"
                className="candidate-details__btn candidate-details__btn--shortlist"
                onClick={() => console.log('Shortlist', candidate.name)}
              >
                Shortlist
              </Button>
              <Button
                variant="primary"
                className="candidate-details__btn candidate-details__btn--reject"
                onClick={() => console.log('Reject', candidate.name)}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CandidateDetails.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    antiCheat: PropTypes.oneOf(['clean', 'flagged', 'critical']).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func,
};
