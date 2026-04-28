import { forwardRef, useState, useId, useRef, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Input } from './Input';
import { Label } from './Label';
import { Hint } from './Hint';
import { Mail, Lock, Search, ChevronDown, Upload, Eye, EyeOff, X } from 'lucide-react';
import './InputField.css';

// Text Input
export const TextInput = memo(
  forwardRef((props, ref) => <Input ref={ref} type="text" {...props} />)
);
TextInput.displayName = 'TextInput';
TextInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
};

// Email Input with validation
export const EmailInput = memo(
  forwardRef(
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
  )
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
export const PasswordInput = memo(
  forwardRef((props, ref) => {
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
  })
);
PasswordInput.displayName = 'PasswordInput';
PasswordInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
};

// Search Input with clear button
export const SearchInput = memo(
  forwardRef(({ value: controlledValue, defaultValue, onChange, ...props }, ref) => {
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
  })
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
export const DropdownInput = memo(
  forwardRef(
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
        variant,
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
      const menuRef = useRef(null);
      const [menuStyle, setMenuStyle] = useState(null);

      const buildMenuStyle = useCallback(() => {
        if (!dropdownRef.current) return null;
        const rect = dropdownRef.current.getBoundingClientRect();
        return {
          position: 'fixed',
          top: rect.bottom + (window.scrollY || window.pageYOffset),
          left: rect.left + (window.scrollX || window.pageXOffset),
          right: 'auto',
          width: rect.width,
          zIndex: 7000,
        };
      }, []);

      const updateMenuPosition = useCallback(() => {
        if (!menuRef.current || !dropdownRef.current) return;
        const rect = dropdownRef.current.getBoundingClientRect();
        const style = menuRef.current.style;
        style.position = 'fixed';
        style.top = `${rect.bottom + (window.scrollY || window.pageYOffset)}px`;
        style.left = `${rect.left + (window.scrollX || window.pageXOffset)}px`;
        style.right = 'auto';
        style.width = `${rect.width}px`;
        style.zIndex = '7000';
      }, []);

      const close = useCallback(() => {
        setIsOpen(false);
        setMenuStyle(null);
      }, []);

      useEffect(() => {
        if (!isOpen) return;
        const handleEvent = (e) => {
          if (e.type === 'keydown' && e.key === 'Escape') close();
          if (
            e.type === 'mousedown' &&
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target) &&
            !(menuRef.current && menuRef.current.contains(e.target))
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

      const handleToggle = () => {
        if (disabled) return;
        if (!isOpen) {
          setMenuStyle(buildMenuStyle());
        }
        setIsOpen((o) => !o);
      };

      useEffect(() => {
        if (!isOpen || !dropdownRef.current) {
          return;
        }
        updateMenuPosition();
        const handleResize = () => {
          updateMenuPosition();
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleResize, true);
        };
      }, [isOpen, updateMenuPosition]);

      const selectedOption = options.find((opt) => opt.value === value);
      const displayText = selectedOption ? selectedOption.label : placeholder;

      return (
        <div
          className={['input', variant && `input--${variant}`, className].filter(Boolean).join(' ')}
        >
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
              className={[
                'dropdown-input__trigger',
                error && 'dropdown-input__trigger--error',
                disabled && 'dropdown-input__trigger--disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={handleToggle}
              disabled={disabled}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={hintId}
              {...props}
            >
              <span
                className={[
                  'dropdown-input__text',
                  !selectedOption && 'dropdown-input__text--placeholder',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {displayText}
              </span>
              <ChevronDown size={16} className="dropdown-input__icon" aria-hidden="true" />
            </button>
            {isOpen
              ? createPortal(
                  <div
                    ref={menuRef}
                    className={['dropdown-input__menu', 'open'].filter(Boolean).join(' ')}
                    role="listbox"
                    style={menuStyle || undefined}
                  >
                    {options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={option.value === value}
                        className={[
                          'dropdown-input__option',
                          option.value === value && 'dropdown-input__option--selected',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => handleSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>,
                  document.body
                )
              : null}
          </div>
          {showHint && hint && (
            <Hint id={hintId} error={error}>
              {hint}
            </Hint>
          )}
        </div>
      );
    }
  )
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
  variant: PropTypes.oneOf(['oncard']),
  className: PropTypes.string,
};

// Textarea Component with character counter and autosize
export const Textarea = memo(
  forwardRef(
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
        variant,
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
        <div
          className={['input', variant && `input--${variant}`, className].filter(Boolean).join(' ')}
        >
          {showLabel && label && (
            <Label htmlFor={textareaId} required={required}>
              {label}
            </Label>
          )}
          <textarea
            ref={mergedRef}
            id={textareaId}
            rows={autosize ? 1 : rows}
            className={['textarea', error && 'textarea--error'].filter(Boolean).join(' ')}
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
  )
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
  variant: PropTypes.oneOf(['oncard']),
  className: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  autosize: PropTypes.bool,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func,
};

// File Upload Input
export const FileInput = memo(
  forwardRef(
    (
      {
        label,
        hint,
        error,
        required,
        showLabel = true,
        showHint = true,
        id,
        variant,
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
        <div
          className={['input', variant && `input--${variant}`, className].filter(Boolean).join(' ')}
        >
          {showLabel && label && (
            <Label htmlFor={fileId} required={required}>
              {label}
            </Label>
          )}
          <div className={['file-input', error && 'file-input--error'].filter(Boolean).join(' ')}>
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
  )
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
  variant: PropTypes.oneOf(['oncard']),
  className: PropTypes.string,
  onChange: PropTypes.func,
};
