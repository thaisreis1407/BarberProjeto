import { Button, ButtonProps } from 'primereact/button';
import React, { useEffect, useMemo } from 'react';

import { showMessage } from '../MessageDialog';

interface IProps extends ButtonProps {
  onClick: () => void;
  messageConfirmation?: string;
  showConfirmation?: boolean;
  autoFocus?: boolean;
}

const ButtonTh = React.forwardRef((props: IProps, ref) => {
  const { messageConfirmation, showConfirmation, autoFocus, onClick, ...rest } = props;

  const buttonRef: any = useMemo(() => {
    if (ref) {
      return ref;
    }
    return React.createRef();
  }, [ref]);

  useEffect(() => {
    if (autoFocus && buttonRef && buttonRef.current && buttonRef.current.focus) {
      setTimeout(() => buttonRef.current.focus(), 200);
    }
  }, [autoFocus, buttonRef]);

  function handleClick() {
    if (showConfirmation) {
      showMessage(
        'Confirmação',
        messageConfirmation || 'Confirma os dados?',
        (idx: number) => {
          if (idx === 1) {
            onClick();
          }
        }
      );
    } else {
      onClick();
    }
  }

  /**
   * Render principal
   */
  return (
    <Button
      ref={buttonRef}
      {...rest}
      onClick={() => {
        if (onClick !== undefined) {
          handleClick();
        }
      }}
    />
  );
});

ButtonTh.defaultProps = {
  messageConfirmation: 'Confirma os dados',
  showConfirmation: false,
  autoFocus: false,
};

export default ButtonTh;
