/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
  style?: React.CSSProperties;
  children: string;
}

export default function LabelTh(props: IProps & React.HTMLAttributes<HTMLLabelElement>) {
  const { style, children, ...rest } = props;
  const styleLocal = style || {};
  return (
    <div style={{ paddingBottom: 2 }}>
      <label style={{ fontWeight: 'bold', ...styleLocal }} {...rest}>
        {children}
      </label>
    </div>
  );
}
LabelTh.defaultProps = {
  style: undefined,
};
