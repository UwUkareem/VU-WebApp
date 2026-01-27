import './Label.css';
import PropTypes from 'prop-types';
import { Info } from 'lucide-react';

export function Label({ required, showInfo, infoTooltip, children, htmlFor, className = '' }) {
  if (!children) return null;

  return (
    <label htmlFor={htmlFor} className={`input-label ${className}`.trim()}>
      <span className="input-label__text">
        {children}
        {required && (
          <span className="input-label__required" aria-label="required">
            *
          </span>
        )}
      </span>
      {showInfo && (
        <span className="input-label__info-wrapper">
          <Info className="input-label__info" size={14} aria-hidden="true" />
          {infoTooltip && (
            <span className="input-label__tooltip" role="tooltip">
              {infoTooltip}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

Label.propTypes = {
  required: PropTypes.bool,
  showInfo: PropTypes.bool,
  infoTooltip: PropTypes.string,
  children: PropTypes.node,
  htmlFor: PropTypes.string,
  className: PropTypes.string,
};
