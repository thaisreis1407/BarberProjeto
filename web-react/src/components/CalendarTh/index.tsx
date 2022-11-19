
import React from 'react';
import { Calendar } from 'primereact/calendar';

interface IProps {
  required: boolean,
  className: string,
  disabled: boolean,
  value: Date
}

export default function CalendarTh(props: IProps) {
  const { value, required, disabled, className, ...rest } = props;
  const classNames = required && !disabled ? `p-error ${className || ''}` : className || '';
  return <Calendar {...rest} disabled={disabled} value={value || ''} className={classNames} />;
}

CalendarTh.defaultProps = {
  required: false,
  disabled: false,
};