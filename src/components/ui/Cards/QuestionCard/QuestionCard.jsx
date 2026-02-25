import PropTypes from 'prop-types';
import { useState, useEffect, useRef, memo } from 'react';
import { ChevronDown, Trash2, Star } from 'lucide-react';
import { TextInput, Textarea, DropdownInput } from '../../Input';
import { Button } from '../../Button';
import './QuestionCard.css';

export const QuestionCard = memo(function QuestionCard({
  questionNumber = 1,
  variant = 'edit',
  title: titleProp,
  description: descriptionProp,
  difficulty: difficultyProp,
  estimatedTime: estimatedTimeProp,
  defaultTitle = '',
  defaultDescription = '',
  defaultDifficulty = '',
  defaultEstimatedTime = '',
  score,
  answer,
  onRemove,
  onDone,
  onChange,
  defaultExpanded = false,
  className = '',
}) {
  const isReview = variant === 'review';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [title, setTitle] = useState(titleProp || defaultTitle);
  const [description, setDescription] = useState(descriptionProp || defaultDescription);
  const [difficulty, setDifficulty] = useState(difficultyProp || defaultDifficulty);
  const [estimatedTime, setEstimatedTime] = useState(estimatedTimeProp || defaultEstimatedTime);
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const cardRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const estimatedTimeOptions = [
    { label: '5 minutes', value: '5 minutes' },
    { label: '10 minutes', value: '10 minutes' },
    { label: '15 minutes', value: '15 minutes' },
    { label: '20 minutes', value: '20 minutes' },
    { label: '30 minutes', value: '30 minutes' },
    { label: '45 minutes', value: '45 minutes' },
  ];

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onChange?.({ title: newTitle, description, difficulty, estimatedTime });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onChange?.({ title, description: newDescription, difficulty, estimatedTime });
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    onChange?.({ title, description, difficulty: value, estimatedTime });
  };

  const handleEstimatedTimeChange = (value) => {
    setEstimatedTime(value);
    onChange?.({ title, description, difficulty, estimatedTime: value });
  };

  const handleDone = () => {
    setIsExpanded(false);
    onDone?.({ title, description, difficulty, estimatedTime });
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove?.();
    }, 300); // Match animation duration
  };

  // Display summary when collapsed
  const getDifficultyLabel = () => {
    const option = difficultyOptions.find((opt) => opt.value === difficulty);
    return option ? option.label : '';
  };

  const summaryText = title || 'Untitled Question';
  const summaryMeta = [estimatedTime, getDifficultyLabel()].filter(Boolean).join(' • ');

  return (
    <div
      ref={cardRef}
      className={[
        'question-card',
        isReview && 'question-card--review',
        isExpanded && 'question-card--expanded',
        isVisible && 'question-card--visible',
        isRemoving && 'question-card--removing',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header - Always visible */}
      <div className="question-card__header">
        <div className="question-card__header-top" onClick={handleToggle}>
          <h3 className="question-card__title">Question {questionNumber}</h3>
          <button type="button" className="question-card__toggle">
            <ChevronDown size={20} className="question-card__toggle-icon" aria-hidden="true" />
          </button>
        </div>

        <div
          className={[
            'question-card__summary-row',
            isExpanded && 'question-card__summary-row--hidden',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="question-card__summary-inner">
            <div className="question-card__summary">
              <span className="question-card__summary-title">{summaryText}</span>
              {summaryMeta && <span className="question-card__summary-meta">{summaryMeta}</span>}
            </div>

            {isReview ? (
              score != null && (
                <div className="question-card__score">
                  <span className="question-card__score-label">Score</span>
                  <Star size={14} className="question-card__score-icon" />
                  <span className="question-card__score-value">{score}</span>
                </div>
              )
            ) : (
              <button
                type="button"
                className="question-card__delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content - Collapsible */}
      <div className="question-card__content">
        <div className="question-card__content-inner">
          {isReview ? (
            <div className="question-card__review-body">
              <div className="question-card__review-fields">
                <div className="question-card__review-field">
                  <span className="question-card__review-label">Title</span>
                  <span className="question-card__review-value">{title}</span>
                </div>
                {description && (
                  <div className="question-card__review-field">
                    <span className="question-card__review-label">Description</span>
                    <span className="question-card__review-value">{description}</span>
                  </div>
                )}
                <div className="question-card__review-row">
                  {difficulty && (
                    <div className="question-card__review-field">
                      <span className="question-card__review-label">Difficulty</span>
                      <span className="question-card__review-value">{getDifficultyLabel()}</span>
                    </div>
                  )}
                  {estimatedTime && (
                    <div className="question-card__review-field">
                      <span className="question-card__review-label">Time</span>
                      <span className="question-card__review-value">{estimatedTime}</span>
                    </div>
                  )}
                </div>
              </div>
              {answer && (
                <div className="question-card__answer">
                  <span className="question-card__answer-label">Candidate Answer</span>
                  <p className="question-card__answer-text">{answer}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <TextInput
                label="Question Title"
                placeholder="Two sum problem"
                value={title}
                onChange={handleTitleChange}
                variant="oncard"
                required
              />

              <Textarea
                label="Question Description"
                placeholder="Text here"
                value={description}
                onChange={handleDescriptionChange}
                rows={5}
                variant="oncard"
                required
              />

              <div className="question-card__row">
                <DropdownInput
                  label="Difficulty"
                  placeholder="Select difficulty"
                  options={difficultyOptions}
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  variant="oncard"
                  required
                />
                <DropdownInput
                  label="Estimated Time"
                  placeholder="Select time"
                  options={estimatedTimeOptions}
                  value={estimatedTime}
                  onChange={handleEstimatedTimeChange}
                  variant="oncard"
                  required
                />
              </div>

              <div className="question-card__actions">
                <Button variant="secondary" onClick={handleRemove} aria-label="Delete question">
                  Delete
                </Button>
                <Button variant="primary" onClick={handleDone} aria-label="Done editing">
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

QuestionCard.propTypes = {
  questionNumber: PropTypes.number,
  variant: PropTypes.oneOf(['edit', 'review']),
  title: PropTypes.string,
  description: PropTypes.string,
  difficulty: PropTypes.string,
  estimatedTime: PropTypes.string,
  defaultTitle: PropTypes.string,
  defaultDescription: PropTypes.string,
  defaultDifficulty: PropTypes.string,
  defaultEstimatedTime: PropTypes.string,
  score: PropTypes.number,
  answer: PropTypes.string,
  onRemove: PropTypes.func,
  onDone: PropTypes.func,
  onChange: PropTypes.func,
  defaultExpanded: PropTypes.bool,
  className: PropTypes.string,
};

export default QuestionCard;
