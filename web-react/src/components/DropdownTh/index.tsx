import { Dropdown, DropdownProps } from 'primereact/dropdown';
import React from 'react';

type IProps = DropdownProps;

export default function DropdownTh(props: IProps) {
  const { required, className, disabled, ...rest } = props;

  const classNames = required && !disabled ? `p-error ${className || ''}` : className || '';
  return <Dropdown {...rest} disabled={disabled} className={classNames} />;
}

DropdownTh.defaultProps = {
  required: false,
  className: '',
  disabled: false,
};
