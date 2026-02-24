import './InputField.css';
import PropTypes from 'prop-types';
import { forwardRef, memo } from 'react';

export const InputField = memo(
  forwardRef(function InputField(
    { iconLeft, iconRight, error, disabled, className = '', ...props },
    ref
  ) {
    const hasIconLeft = !!iconLeft;
    const hasIconRight = !!iconRight;

    return (
      <div
        className={[
          'input-field',
          hasIconLeft && 'input-field--icon-left',
          hasIconRight && 'input-field--icon-right',
          error && 'input-field--error',
          disabled && 'input-field--disabled',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {iconLeft && (
          <span className="input-field__icon input-field__icon--left" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          className="input-field__input"
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {iconRight && (
          <span className="input-field__icon input-field__icon--right" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </div>
    );
  })
);

InputField.propTypes = {
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
