import { Calendar, CalendarProps } from 'primereact/calendar';
import React from 'react';

interface IProps extends CalendarProps {
  required?: boolean;
  className?: string;
  disabled?: boolean;
  value: Date;
}

export default function CalendarTh(props: IProps) {
  const { value, required, disabled, className, ...rest } = props;
  const classNames = required && !disabled ? `p-error ${className || ''}` : className || '';
  return <Calendar {...rest} disabled={disabled} value={value || ''} className={classNames} />;
}

CalendarTh.defaultProps = {
  required: false,
  disabled: false,
  className: '',
};
