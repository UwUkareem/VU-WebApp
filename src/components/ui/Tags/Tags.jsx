import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { X, Plus, Check } from 'lucide-react';
import './Tags.css';

export function Tags({
  title,
  tags = [],
  onAdd,
  onRemove,
  variant = 'editable',
  showTitle = true,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const inputRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Focus input when adding mode is activated
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const isEditable = variant === 'editable';

  const handleRemoveTag = (index, e) => {
    e.stopPropagation();
    onRemove?.(index);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSubmitTag = () => {
    const trimmedValue = newTagValue.trim();
    if (trimmedValue && onAdd) {
      onAdd(trimmedValue);
      setNewTagValue('');
      // Keep input open for multi-add
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleCancelAdd = () => {
    setNewTagValue('');
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitTag();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  return (
    <div className={`tags ${isVisible ? 'tags--visible' : ''} ${className}`.trim()}>
      {showTitle && title && <h3 className="tags__title">{title}</h3>}

      <div className="tags__container">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`tags__tag ${isVisible ? 'tags__tag--visible' : ''}`}
            style={{ '--tag-index': index }}
          >
            <span className="tags__tag-text">{tag}</span>
            {isEditable && (
              <button
                type="button"
                className="tags__tag-remove"
                onClick={(e) => handleRemoveTag(index, e)}
                aria-label={`Remove ${tag}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {isEditable &&
          (isAdding ? (
            <div className="tags__input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="tags__input"
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleCancelAdd}
                placeholder="Enter tag name"
                maxLength={30}
              />
              <button
                type="button"
                className="tags__input-submit"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSubmitTag();
                }}
                aria-label="Submit tag"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="tags__add-btn"
              onClick={handleAddClick}
              aria-label="Add tag"
            >
              <span>Add</span>
              <Plus size={16} />
            </button>
          ))}
      </div>
    </div>
  );
}

Tags.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  variant: PropTypes.oneOf(['editable', 'readonly']),
  showTitle: PropTypes.bool,
  className: PropTypes.string,
};

export default Tags;
