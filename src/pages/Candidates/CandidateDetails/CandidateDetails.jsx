import { useState, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Briefcase, MapPin, Calendar, Check, List, X } from 'lucide-react';
import { EntityCard } from '../../../components/ui/Cards';
import { Tabs } from '../../../components/ui/Tabs';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { ActionCard } from '../../../components/ui/Cards';
import { FullFeedback } from './FullFeedback';
import { MockReplay } from './MockReplay';
import { CVAnalysis } from './CVAnalysis';
import './CandidateDetails.css';

const COMPLETED_MOCKS = [
  {
    id: 1,
    title: 'Technical Coding Challenge',
    subtitle: 'Hard • Technical • 60min',
    score: 95,
  },
  {
    id: 2,
    title: 'System Design Interview',
    subtitle: 'Medium \u2022 Architecture \u2022 45min',
    score: 77,
  },
  {
    id: 3,
    title: 'Behavioral Assessment',
    subtitle: 'Easy \u2022 Soft Skills \u2022 30min',
    score: 88,
  },
];

const DECISION_ACTIONS = [
  { id: 'accept', label: 'Accept', icon: Check, className: 'candidate-details__decision--accept' },
  {
    id: 'shortlist',
    label: 'Shortlist',
    icon: List,
    className: 'candidate-details__decision--shortlist',
  },
  { id: 'reject', label: 'Reject', icon: X, className: 'candidate-details__decision--reject' },
];

export const CandidateDetails = memo(function CandidateDetails({ candidate }) {
  const [activeTab, setActiveTab] = useState('feedback');

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const tabs = useMemo(
    () => [
      {
        label: 'Full Feedback',
        isActive: activeTab === 'feedback',
        onClick: () => handleTabChange('feedback'),
      },
      {
        label: 'Mock Replay',
        isActive: activeTab === 'replay',
        onClick: () => handleTabChange('replay'),
      },
      {
        label: 'CV Analysis',
        isActive: activeTab === 'analysis',
        onClick: () => handleTabChange('analysis'),
      },
    ],
    [activeTab, handleTabChange]
  );

  const handleDecision = useCallback(
    (action) => {
      console.log(`Decision: ${action} for`, candidate.name);
    },
    [candidate.name]
  );

  return (
    <div className="candidate-details">
      {/* Left Section */}
      <div className="candidate-details__main">
        <EntityCard
          userName={candidate.name}
          userEmail={`${candidate.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}
          showBadge
          badgeType="candidateState"
          badgeVariant={candidate.status}
          score={candidate.score}
          colLeft={{ icon: Briefcase, title: candidate.job, subtitle: 'Applied Job' }}
          colMid={{ icon: MapPin, title: 'Cairo, Egypt', subtitle: 'Location' }}
          colRight={{ icon: Calendar, title: candidate.date, subtitle: 'Applied Date' }}
          animated={false}
        />

        <div className="candidate-details__tabs-container">
          <Tabs items={tabs} />

          <div className="candidate-details__tab-content">
            {activeTab === 'feedback' && <FullFeedback candidate={candidate} />}
            {activeTab === 'replay' && <MockReplay candidate={candidate} />}
            {activeTab === 'analysis' && <CVAnalysis candidate={candidate} />}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <aside className="candidate-details__sidebar">
        <div className="candidate-details__sidebar-section candidate-details__sidebar-section--decision">
          <SectionTitle>Select Decision</SectionTitle>
          <div className="candidate-details__decisions">
            {DECISION_ACTIONS.map((action) => (
              <button
                key={action.id}
                className={['candidate-details__decision-btn', action.className]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleDecision(action.id)}
              >
                <action.icon size={18} className="candidate-details__decision-icon" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="candidate-details__sidebar-section">
          <SectionTitle>Completed Mocks</SectionTitle>
          <div className="candidate-details__mocks">
            {COMPLETED_MOCKS.map((mock) => (
              <ActionCard
                key={mock.id}
                title={mock.title}
                subtitle={mock.subtitle}
                descriptionTitle="Score"
                showDescriptionIcon
                descriptionNumber={mock.score}
                animated
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
});

CandidateDetails.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    antiCheat: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
