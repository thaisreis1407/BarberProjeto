import { InputTextProps } from 'primereact/inputtext';
import React, { useState, useEffect, useMemo } from 'react';

import { formatFloat, strNumBrToNumber } from '../../util/functions';
import InputTextTh from '../InputTextTh';

interface IProps extends InputTextProps {
  onChangeNumber: (event: any, value: number) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  digits?: number;
  value?: string | number;
  onlyPositive?: boolean;
  autoFocus?: boolean;
}

const InputCurrencyTh = React.forwardRef((props: IProps, ref) => {
  // eslint-disable-next-line no-unused-vars
  const {
    autoFocus,
    onChangeNumber,
    onBlur,
    onFocus,
    value,
    digits,
    onlyPositive,
    ...inputProps
  } = props;
  const propValue = onlyPositive && (value || 0) < 0 ? 0 : value || 0;
  const internalDigits = digits! >= 0 ? digits : 2;
  const [internalValue, setInternalValue] = useState(Number(value) || 0);
  const [formatedValue, setFormatedValue] = useState(
    formatFloat(Number(propValue), internalDigits)
  );

  const inputRef: any = useMemo(() => {
    if (ref) {
      return ref;
    }
    return React.createRef();
  }, [ref]);

  useEffect(() => {
    setFormatedValue(formatFloat(Number(propValue), internalDigits));
    setInternalValue(Number(propValue));
  }, [internalDigits, propValue]);

  useEffect(() => {
    if (autoFocus && inputRef && inputRef.current && inputRef.current.focus) {
      setTimeout(() => inputRef.current.focus(), 200);
    }
  }, [autoFocus, inputRef]);

  const handleChange = (event: any) => {
    setFormatedValue(event.target.value);
    const val = event.target.value;
    const valNumeric = strNumBrToNumber(val, 0) || 0;

    setInternalValue(Number(valNumeric.toFixed(internalDigits)));
  };

  const handleBlur = (event: any) => {
    setFormatedValue(formatFloat(internalValue, internalDigits));

    if (onBlur !== undefined || onChangeNumber !== undefined) {
      event.persist();
    }

    if (onBlur) {
      onBlur(event);
    }

    if (onChangeNumber) {
      onChangeNumber(event, internalValue);
    }
  };

  const handleFocus = (event: any) => {
    setFormatedValue(formatFloat(internalValue, internalDigits).replace(/\./g, ''));
    if (onFocus) {
      event.persist();
      onFocus(event);
    }
    const { target } = event;
    setTimeout(() => {
      target.select();
    }, 100);
  };
  const filterType = onlyPositive ? 'money' : 'num';
  return (
    <InputTextTh
      style={{ textAlign: 'end' }}
      {...inputProps}
      value={formatedValue}
      onChange={handleChange}
      keyfilter={filterType}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
});

InputCurrencyTh.defaultProps = {
  value: 0,
  digits: 2,
  onlyPositive: true,
  onFocus: undefined,
  onBlur: undefined,
  autoFocus: false,
};

export default InputCurrencyTh;
