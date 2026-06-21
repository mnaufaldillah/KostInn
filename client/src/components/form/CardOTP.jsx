import { useRef } from 'react';
import PropTypes from 'prop-types';

const LENGTH = 6;

function CardOTP({ id, value, onChange, error, disabled }) {
  const refs = useRef([]);

  const digits = value.padEnd(LENGTH, ' ').slice(0, LENGTH).split('');

  const setDigit = (i, d) => {
    const next = value.padEnd(LENGTH, ' ').slice(0, LENGTH).split('');
    next[i] = d;
    onChange(next.join('').trimEnd());
  };

  const handleChange = (i, raw) => {
    const d = raw.replace(/\D/g, '').slice(-1);
    if (!d) return setDigit(i, ' ');
    setDigit(i, d);
    if (i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i].trim() && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;
    onChange(padded(pasted));
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  return (
    <div className="ki-otp-group" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          id={i === 0 ? id : undefined}
          aria-label={`Digit ${i + 1}`}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={d.trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`form-control ki-otp-input${error ? ' is-error' : ''}`}
        />
      ))}
    </div>
  );
}

const padded = (v) => v.padEnd(LENGTH, ' ').slice(0, LENGTH);

CardOTP.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
};

CardOTP.defaultProps = {
  id: undefined,
  value: '',
  error: false,
  disabled: false,
};

export default CardOTP;
