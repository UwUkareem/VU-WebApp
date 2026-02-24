import PropTypes from 'prop-types';
import { useState, useEffect, useRef, memo } from 'react';
import { ChevronDown, Trash2, Check } from 'lucide-react';
import { TextInput, Textarea, DropdownInput } from '../../Input';
import { Button } from '../../Button';
import './QuestionCard.css';

export const QuestionCard = memo(function QuestionCard({
  questionNumber = 1,
  title: titleProp,
  description: descriptionProp,
  difficulty: difficultyProp,
  estimatedTime: estimatedTimeProp,
  defaultTitle = '',
  defaultDescription = '',
  defaultDifficulty = '',
  defaultEstimatedTime = '',
  onRemove,
  onDone,
  onChange,
  defaultExpanded = false,
  className = '',
}) {
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
          </div>
        </div>
      </div>

      {/* Content - Collapsible */}
      <div className="question-card__content">
        <div className="question-card__content-inner">
          {/* Question Title Input */}
          <TextInput
            label="Question Title"
            placeholder="Two sum problem"
            value={title}
            onChange={handleTitleChange}
            variant="oncard"
            required
          />

          {/* Question Description Textarea */}
          <Textarea
            label="Question Description"
            placeholder="Text here"
            value={description}
            onChange={handleDescriptionChange}
            rows={5}
            variant="oncard"
            required
          />

          {/* Bottom Row - Difficulty and Estimated Time */}
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

          {/* Actions */}
          <div className="question-card__actions">
            <Button variant="secondary" onClick={handleRemove} aria-label="Delete question">
              Delete
            </Button>
            <Button variant="primary" onClick={handleDone} aria-label="Done editing">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

QuestionCard.propTypes = {
  questionNumber: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  difficulty: PropTypes.string,
  estimatedTime: PropTypes.string,
  defaultTitle: PropTypes.string,
  defaultDescription: PropTypes.string,
  defaultDifficulty: PropTypes.string,
  defaultEstimatedTime: PropTypes.string,
  onRemove: PropTypes.func,
  onDone: PropTypes.func,
  onChange: PropTypes.func,
  defaultExpanded: PropTypes.bool,
  className: PropTypes.string,
};

export default QuestionCard;
