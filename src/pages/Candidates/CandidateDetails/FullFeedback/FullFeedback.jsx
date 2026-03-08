import { memo } from 'react';
import PropTypes from 'prop-types';
import { BarChart, RadarChart } from '../../../../components/ui/Charts';
import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { InfoCard, ActionCard, QuestionCard } from '../../../../components/ui/Cards';
import './FullFeedback.css';

const SKILL_DATA = [
  { label: 'Communication', value: 88 },
  { label: 'Problem Solving', value: 76 },
  { label: 'Technical Skills', value: 92 },
  { label: 'System Design', value: 64 },
  { label: 'Code Quality', value: 81 },
];

const SKILL_DISTRIBUTION = [
  { label: 'Communication', value: 88 },
  { label: 'Problem Solving', value: 76 },
  { label: 'Technical', value: 92 },
  { label: 'Design', value: 64 },
  { label: 'Leadership', value: 70 },
];

const AI_INSIGHTS = [
  {
    id: 1,
    title: 'Strong Technical Foundation',
    description:
      'Candidate demonstrates deep understanding of data structures and algorithms with clean implementations.',
  },
  {
    id: 2,
    title: 'Effective Communicator',
    description:
      'Clearly articulates thought process and trade-offs during problem-solving sessions.',
  },
  {
    id: 3,
    title: 'Scalability Awareness',
    description:
      'Consistently considers edge cases, performance bottlenecks, and production-level constraints.',
  },
];

const CHEATING_DETECTION = {
  title: 'Cheating Detection',
  status: 'clean',
  description:
    'Nothing detected. Excellent structured approach with clear consideration of scalability and trade-offs.',
};

const QUESTIONS = [
  {
    id: 1,
    number: 1,
    title: 'Two Sum Problem',
    description:
      'Given an array of integers and a target, return indices of two numbers that add up to the target.',
    difficulty: 'easy',
    time: '8 min',
    score: 95,
    answer:
      'Used a hash map approach with O(n) time complexity. Iterated through the array once, storing complements as keys. Handled edge cases for duplicate values and negative numbers correctly.',
  },
  {
    id: 2,
    number: 2,
    title: 'LRU Cache Design',
    description:
      'Design and implement a Least Recently Used cache with O(1) get and put operations.',
    difficulty: 'medium',
    time: '15 min',
    score: 82,
    answer:
      'Implemented using a doubly linked list combined with a hash map. The linked list maintains access order while the map provides constant-time lookups. Discussed thread-safety considerations.',
  },
  {
    id: 3,
    number: 3,
    title: 'System Design: URL Shortener',
    description:
      'Design a URL shortening service like bit.ly that can handle millions of requests per day.',
    difficulty: 'hard',
    time: '22 min',
    score: 71,
    answer:
      'Proposed a base-62 encoding scheme with a distributed counter for ID generation. Covered database sharding strategy, caching layer with Redis, and rate limiting. Could improve on analytics pipeline design.',
  },
];

export const FullFeedback = memo(function FullFeedback() {
  return (
    <div className="full-feedback">
      {/* Charts Section */}
      <div className="full-feedback__charts">
        <BarChart
          title="Skill Distribution"
          data={SKILL_DATA}
          dataKeys={[{ key: 'value', label: 'Score' }]}
          animated
        />
        <RadarChart title="Score Breakdown" stats={SKILL_DISTRIBUTION} animated />
      </div>

      {/* AI Insights Section */}
      <div className="full-feedback__section">
        <SectionTitle>AI Insights</SectionTitle>
        <div className="full-feedback__insights">
          <div className="full-feedback__insights-row">
            {AI_INSIGHTS.map((insight) => (
              <InfoCard
                key={insight.id}
                title={insight.title}
                description={insight.description}
                animated
              />
            ))}
          </div>
          <ActionCard
            title={CHEATING_DETECTION.title}
            showBadge
            badgeType="cheatingFlag"
            badgeVariant={CHEATING_DETECTION.status}
            badgeIcon={true}
            content={CHEATING_DETECTION.description}
            animated
          />
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="full-feedback__section">
        <SectionTitle>Question-by-Question Review</SectionTitle>
        <div className="full-feedback__questions">
          {QUESTIONS.map((q) => (
            <QuestionCard
              key={q.id}
              questionNumber={q.number}
              variant="review"
              title={q.title}
              description={q.description}
              difficulty={q.difficulty}
              estimatedTime={q.time}
              score={q.score}
              answer={q.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

FullFeedback.propTypes = {
  candidate: PropTypes.object,
};
