import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import React from 'react';

interface IProps extends InputTextareaProps {
  required?: boolean;
  className?: string;
  disabled: boolean;
  resize?: boolean;
  value: string;
}
export default function InputTextareaTh(props: IProps) {
  const { value, required, disabled, className, resize, ...rest } = props;

  let classNames = required && !disabled ? `p-error ${className || ''}` : className || '';
  if (!resize) {
    classNames += ' unresize ';
  }

  return (
    <InputTextarea
      autoComplete="none"
      {...rest}
      disabled={disabled}
      value={value || ''}
      className={classNames}
    />
  );
}

InputTextareaTh.defaultProps = {
  required: false,
  resize: true,
};

InputTextareaTh.defaultProps = {
  required: false,
  resize: true,
  className: '',
};
