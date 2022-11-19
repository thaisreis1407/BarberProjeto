
import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

interface IProps {
  required: boolean;
  className: string;
  disabled: boolean;
  resize: boolean;
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
};
