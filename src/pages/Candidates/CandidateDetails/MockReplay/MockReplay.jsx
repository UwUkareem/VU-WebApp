import { memo } from 'react';
import PropTypes from 'prop-types';
import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { ActionCard } from '../../../../components/ui/Cards';
import './MockReplay.css';

const TRANSCRIPT = [
  {
    id: 1,
    speaker: 'AI',
    message: 'How would you handle data consistency in this system?',
    time: '03:15',
  },
  {
    id: 2,
    speaker: 'Candidate',
    message:
      'I would use a combination of optimistic locking and event sourcing to ensure that all state mutations are tracked and recoverable.',
    time: '03:42',
    score: 95,
  },
  {
    id: 3,
    speaker: 'AI',
    message: 'Can you walk me through your caching strategy?',
    time: '05:10',
  },
  {
    id: 4,
    speaker: 'Candidate',
    message:
      'I would use a write-through cache with Redis, invalidating on writes. For read-heavy endpoints, a CDN layer in front. TTLs tuned per resource type.',
    time: '05:38',
    score: 88,
  },
  {
    id: 5,
    speaker: 'AI',
    message: 'How would you approach scaling this service to handle 10x traffic?',
    time: '08:22',
  },
  {
    id: 6,
    speaker: 'Candidate',
    message:
      'Horizontal scaling behind a load balancer, database read replicas, and moving heavy processing to async job queues with retry logic.',
    time: '08:55',
    score: 82,
  },
];

export const MockReplay = memo(function MockReplay() {
  return (
    <div className="mock-replay">
      {/* Video Player Section */}
      <div className="mock-replay__section">
        <div className="mock-replay__player">
          <video className="mock-replay__video" controls preload="metadata" poster="">
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Transcript Section */}
      <div className="mock-replay__section">
        <SectionTitle>Transcript with AI Annotations</SectionTitle>
        <div className="mock-replay__transcript">
          {TRANSCRIPT.map((entry) => {
            return (
              <ActionCard
                key={entry.id}
                className={`mock-replay__entry mock-replay__entry--${entry.speaker.toLowerCase()}`}
                title={entry.speaker}
                subtitle={entry.message}
                caption={entry.time}
                descriptionTitle={entry.score != null ? 'Score' : undefined}
                showDescriptionIcon={entry.score != null}
                descriptionNumber={entry.score}
                animated
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

MockReplay.propTypes = {
  candidate: PropTypes.object,
};
