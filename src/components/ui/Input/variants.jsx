import { forwardRef, useState, useId, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input } from './Input';
import { Label } from './Label';
import { Hint } from './Hint';
import { User, Mail, Lock, Search, ChevronDown, Upload, Eye, EyeOff, X } from 'lucide-react';
import './InputField.css';

// Text Input
export const TextInput = forwardRef((props, ref) => <Input ref={ref} type="text" {...props} />);
TextInput.displayName = 'TextInput';
TextInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
};

// Email Input with validation
export const EmailInput = forwardRef(
  (
    {
      value: controlledValue,
      defaultValue,
      onBlur,
      onChange,
      hint: hintProp,
      error: errorProp,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [internalError, setInternalError] = useState(false);
    const [internalHint, setInternalHint] = useState(hintProp);
    const inputRef = useRef(null);
    const isControlled = controlledValue !== undefined;
    const displayValue = isControlled ? controlledValue : internalValue;

    // Simple email regex fallback
    const isValidEmail = (email) => {
      if (!email) return true; // empty is valid (use required prop for mandatory)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateEmail = (email) => {
      // Try native checkValidity first if available
      if (inputRef.current && inputRef.current.checkValidity) {
        return inputRef.current.checkValidity();
      }
      // Fallback to regex
      return isValidEmail(email);
    };

    const handleBlur = (e) => {
      const value = e.target.value;
      if (value && !validateEmail(value)) {
        setInternalError(true);
        setInternalHint('Enter a valid email');
      } else {
        setInternalError(false);
        setInternalHint(hintProp);
      }
      onBlur?.(e);
    };

    const handleChange = (e) => {
      const value = e.target.value;
      if (!isControlled) {
        setInternalValue(value);
      }
      // Clear error when user types
      if (internalError && value && validateEmail(value)) {
        setInternalError(false);
        setInternalHint(hintProp);
      }
      onChange?.(e);
    };

    return (
      <Input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="email"
        iconLeft={<Mail size={16} />}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        error={internalError || errorProp}
        hint={internalHint || hintProp}
        {...props}
      />
    );
  }
);
EmailInput.displayName = 'EmailInput';
EmailInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
};

// Password Input (with toggle visibility)
export const PasswordInput = forwardRef(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      iconLeft={<Lock size={16} />}
      iconRight={
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = 'PasswordInput';
PasswordInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
};

// Search Input with clear button
export const SearchInput = forwardRef(
  ({ value: controlledValue, defaultValue, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const displayValue = isControlled ? controlledValue : internalValue;

    const handleChange = (e) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('');
      }
      // Create synthetic event for onChange
      if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        };
        onChange(syntheticEvent);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder="Search..."
        iconLeft={<Search size={16} />}
        iconRight={
          displayValue ? (
            <button
              type="button"
              className="search-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null
        }
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';
SearchInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

// Dropdown Input with custom dropdown (like RoleBadge)
export const DropdownInput = forwardRef(
  (
    {
      label,
      hint,
      error,
      required,
      showLabel = true,
      showHint = true,
      id,
      options = [],
      placeholder = 'Select...',
      value,
      onChange,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
      if (!isOpen) return;
      const handleEvent = (e) => {
        if (e.type === 'keydown' && e.key === 'Escape') close();
        if (
          e.type === 'mousedown' &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
        )
          close();
      };
      document.addEventListener('mousedown', handleEvent);
      document.addEventListener('keydown', handleEvent);
      return () => {
        document.removeEventListener('mousedown', handleEvent);
        document.removeEventListener('keydown', handleEvent);
      };
    }, [isOpen, close]);

    const handleSelect = (optionValue) => {
      onChange?.(optionValue);
      close();
    };

    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
      <div className={`input ${className}`.trim()}>
        {showLabel && label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div ref={dropdownRef} className="dropdown-input">
          <button
            ref={ref}
            id={inputId}
            type="button"
            className={`dropdown-input__trigger${error ? ' dropdown-input__trigger--error' : ''}${disabled ? ' dropdown-input__trigger--disabled' : ''}`}
            onClick={() => !disabled && setIsOpen((o) => !o)}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={hintId}
            {...props}
          >
            <span
              className={`dropdown-input__text${!selectedOption ? ' dropdown-input__text--placeholder' : ''}`}
            >
              {displayText}
            </span>
            <ChevronDown size={16} className="dropdown-input__icon" aria-hidden="true" />
          </button>
          {isOpen && (
            <div className="dropdown-input__menu" role="listbox">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`dropdown-input__option${option.value === value ? ' dropdown-input__option--selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {showHint && hint && (
          <Hint id={hintId} error={error}>
            {hint}
          </Hint>
        )}
      </div>
    );
  }
);
DropdownInput.displayName = 'DropdownInput';
DropdownInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  showHint: PropTypes.bool,
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

// Textarea Component with character counter and autosize
export const Textarea = forwardRef(
  (
    {
      label,
      hint,
      error,
      required,
      showLabel = true,
      showHint = true,
      showCounter = false,
      id,
      className = '',
      rows = 4,
      maxLength,
      autosize = false,
      maxHeight = 300,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const textareaRef = useRef(null);
    const [charCount, setCharCount] = useState(0);

    // Autosize functionality
    const adjustHeight = useCallback(() => {
      if (autosize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }, [autosize, maxHeight]);

    const handleChange = (e) => {
      setCharCount(e.target.value.length);
      adjustHeight();
      onChange?.(e);
    };

    useEffect(() => {
      if (autosize) {
        adjustHeight();
      }
    }, [autosize, adjustHeight]);

    // Merge refs
    const mergedRef = (node) => {
      textareaRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={`input ${className}`.trim()}>
        {showLabel && label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}
        <textarea
          ref={mergedRef}
          id={textareaId}
          rows={autosize ? 1 : rows}
          className={`textarea${error ? ' textarea--error' : ''}`}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={hintId}
          onChange={handleChange}
          {...props}
        />
        {showCounter && maxLength && (
          <div className="textarea__counter">
            {charCount} / {maxLength}
          </div>
        )}
        {showHint && hint && (
          <Hint id={hintId} error={error}>
            {hint}
          </Hint>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
Textarea.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  showHint: PropTypes.bool,
  showCounter: PropTypes.bool,
  id: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  autosize: PropTypes.bool,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func,
};

// File Upload Input
export const FileInput = forwardRef(
  (
    {
      label,
      hint,
      error,
      required,
      showLabel = true,
      showHint = true,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fileId = id || generatedId;
    const hintId = hint ? `${fileId}-hint` : undefined;
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      setFileName(file ? file.name : '');
      props.onChange?.(e);
    };

    return (
      <div className={`input ${className}`.trim()}>
        {showLabel && label && (
          <Label htmlFor={fileId} required={required}>
            {label}
          </Label>
        )}
        <div className={`file-input${error ? ' file-input--error' : ''}`}>
          <label htmlFor={fileId} className="file-input__label">
            <Upload size={16} className="file-input__icon" aria-hidden="true" />
            <span className="file-input__text">{fileName || 'Choose file...'}</span>
          </label>
          <input
            ref={ref}
            id={fileId}
            type="file"
            className="file-input__native"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={hintId}
            onChange={handleFileChange}
            {...props}
          />
        </div>
        {showHint && hint && (
          <Hint id={hintId} error={error}>
            {hint}
          </Hint>
        )}
      </div>
    );
  }
);
FileInput.displayName = 'FileInput';
FileInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  showHint: PropTypes.bool,
  id: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};
