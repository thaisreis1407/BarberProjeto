import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from './styles';

interface IProps {
  paddingLeftIcon?: number;
}

export default function DisplayBlock(props: IProps) {
  const loading = useSelector((state: any) => state.global.loading);
  const { paddingLeftIcon } = props;

  if (loading) {
    return (
      <Container>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            justifyItems: 'center',
            display: 'flex',
          }}
        >
          <div
            style={{
              flex: 1,
              alignItems: 'center',
              justifyItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="div-icon" style={{ paddingLeft: paddingLeftIcon || 0 }}>
              <ProgressSpinner
                style={{ width: 50, height: 50 }}
                strokeWidth="8"
                animationDuration=".5s"
              />
            </div>
          </div>
        </div>
      </Container>
    );
  }
  return null;
}

DisplayBlock.defaultProps = {
  paddingLeftIcon: 0,
};
