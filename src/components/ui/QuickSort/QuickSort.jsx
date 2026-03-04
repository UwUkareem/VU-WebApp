import { memo } from 'react';
import PropTypes from 'prop-types';
import './QuickSort.css';

const EMPTY_GROUPS = [];

export const QuickSort = memo(function QuickSort({ groups = EMPTY_GROUPS, className = '' }) {
  return (
    <div className={['quick-sort', className].filter(Boolean).join(' ')}>
      {groups.map((group, index) => (
        <div key={group.label || index} className="quick-sort__group">
          <span className="quick-sort__label">{group.label}</span>
          <div className="quick-sort__options">
            {group.options.map((option) => (
              <button
                key={option}
                type="button"
                className={['quick-sort__btn', group.value === option && 'quick-sort__btn--active']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => group.onChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

QuickSort.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    })
  ),
  className: PropTypes.string,
};
