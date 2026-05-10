import { useState, useId } from 'react';
import type { ChangeEvent, CSSProperties } from 'react';

export interface SliderProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
  id?: string;
  className?: string;
}

export function Slider({
  label,
  value: valueProp,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  suffix,
  disabled = false,
  onChange,
  id,
  className = '',
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const fillStyle: CSSProperties = { '--slider-fill': `${pct}%` } as CSSProperties;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = Number(e.target.value);
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  }

  return (
    <div className={`slider ${className}`.trim()}>
      {label && (
        <div className="slider__header">
          <label htmlFor={inputId} className="slider__label">
            {label}
          </label>
          <span className="slider__value" aria-live="polite">
            {value}
            {suffix && <span className="slider__suffix">{suffix}</span>}
          </span>
        </div>
      )}
      <input
        id={inputId}
        type="range"
        className="slider__track"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        style={fillStyle}
        onChange={handleChange}
        aria-label={label}
        aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
      />
    </div>
  );
}
