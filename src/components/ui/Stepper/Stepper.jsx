import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import './Stepper.css';

/**
 * Stepper — horizontal wizard progress indicator.
 * Each step can be upcoming, active, or completed.
 */
export const Stepper = memo(function Stepper({
  steps = [],
  activeStep = 0,
  onStepClick,
  stepValidity = {},
  className = '',
}) {
  const handleClick = useCallback(
    (index) => {
      if (!onStepClick || index === activeStep) return;
      onStepClick(index);
    },
    [onStepClick, activeStep]
  );

  return (
    <nav className={`stepper ${className}`.trim()} aria-label="Progress">
      <ol className="stepper__list">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          // Clickable: any completed step, OR a future step if all prior steps are valid
          const isReachable = (() => {
            if (isCompleted) return true;
            if (index <= activeStep) return false;
            for (let i = activeStep; i < index; i++) {
              if (!stepValidity[i]) return false;
            }
            return true;
          })();
          const isClickable = !!onStepClick && (isCompleted || isReachable);

          const stateClass = isCompleted
            ? 'stepper__step--completed'
            : isActive
              ? 'stepper__step--active'
              : isReachable
                ? 'stepper__step--reachable'
                : 'stepper__step--upcoming';

          return (
            <li key={step.label} className={`stepper__step ${stateClass}`}>
              {/* Connector line (not on first step) */}
              {index > 0 && (
                <span
                  className={`stepper__connector ${isCompleted || isActive ? 'stepper__connector--filled' : ''}`}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                className="stepper__button"
                onClick={() => handleClick(index)}
                disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="stepper__indicator">
                  {isCompleted ? (
                    <Check size={12} strokeWidth={2.5} />
                  ) : (
                    <span className="stepper__number">{index + 1}</span>
                  )}
                </span>
                <span className="stepper__label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Stepper.propTypes = {
  /** Array of step objects: [{ label: 'Step Name' }] */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Zero-based index of the current active step */
  activeStep: PropTypes.number,
  /** Called with step index when clicking a completed step */
  onStepClick: PropTypes.func,
  /** Object mapping step index to boolean validity (for forward nav) */
  stepValidity: PropTypes.object,
  className: PropTypes.string,
};
