import './Input.css';
import PropTypes from 'prop-types';
import { forwardRef, useId } from 'react';
import { Label } from './Label';
import { Hint } from './Hint';
import { InputField } from './InputField';

export const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    required,
    showInfo,
    infoTooltip,
    showLabel = true,
    showHint = true,
    iconLeft,
    iconRight,
    id,
    className = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`input ${className}`.trim()}>
      {showLabel && label && (
        <Label htmlFor={inputId} required={required} showInfo={showInfo} infoTooltip={infoTooltip}>
          {label}
        </Label>
      )}
      <InputField
        ref={ref}
        id={inputId}
        iconLeft={iconLeft}
        iconRight={iconRight}
        error={error}
        aria-describedby={hintId}
        {...props}
      />
      {showHint && hint && (
        <Hint id={hintId} error={error}>
          {hint}
        </Hint>
      )}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  showInfo: PropTypes.bool,
  infoTooltip: PropTypes.string,
  showLabel: PropTypes.bool,
  showHint: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
};
