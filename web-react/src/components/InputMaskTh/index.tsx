import { InputMask, InputMaskProps } from 'primereact/inputmask';
import React from 'react';

interface IProps extends InputMaskProps {
  required?: boolean;
  className?: string;
  disabled?: boolean;
  value: string | undefined;
}

export default function InputMaskTh(props: IProps) {
  const { value, required, disabled, className, ...rest } = props;

  const classNames = required && !disabled ? `p-error ${className || ''}` : className || '';

  return (
    <InputMask
      autoComplete="none"
      {...rest}
      disabled={disabled}
      value={value || ''}
      className={classNames}
    />
  );
}

InputMaskTh.defaultProps = {
  required: false,
  className: '',
  disabled: false,
};
