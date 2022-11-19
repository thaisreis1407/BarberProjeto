import { InputText, InputTextProps } from 'primereact/inputtext';
import React, { useEffect, useMemo } from 'react';

interface IProps extends InputTextProps {
  required?: boolean;
  className?: string;
  disabled?: boolean;
  requiredDisabled?: boolean;
  autoFocus?: boolean;
}

const InputTextTh = React.forwardRef((props: IProps, ref) => {
  const { value, required, disabled, className, autoFocus, requiredDisabled, ...rest } = props;

  const inputRef: any = useMemo(() => {
    if (ref) {
      return ref;
    }
    return React.createRef();
  }, [ref]);

  useEffect(() => {
    if (autoFocus && inputRef && inputRef.current && inputRef.current.focus) {
      setTimeout(() => inputRef.current.focus(), 200);
    }
  }, [autoFocus, inputRef]);

  const classNames =
    (required && !disabled) || requiredDisabled
      ? `p-error ${className || ''}`
      : className || '';

  return (
    <InputText
      ref={inputRef}
      autoComplete="none"
      {...rest}
      disabled={disabled}
      value={value || ''}
      className={classNames}
    />
  );
});

InputTextTh.defaultProps = {
  disabled: false,
  className: '',
  required: false,
  autoFocus: false,
  requiredDisabled: false,
};

export default InputTextTh;
