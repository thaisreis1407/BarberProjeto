/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable global-require */

/**
 * Página Home
 * @module Home
 * @category Pages
 */

import React, { useState } from 'react';

import { isScreenMobile } from '../../util/functions';
import { Container } from './styles';

export default function Home() {
  const [max, setMax] = useState(isScreenMobile() ? 350 : 450);
  const [paddingTop, setPaddingTop] = useState(
    (window.innerHeight * (1 - max / 1000)) / 2 - 20
  );

  const logo = require('../../assets/images/logo.png');

  addEventListener('resize', () => {
    const maxTemp = isScreenMobile() ? 350 : 450;
    setMax(maxTemp);
    setPaddingTop((window.innerHeight * (1 - maxTemp / 1000)) / 2 - 20);
  });

  return (
    <Container>
      <div className="grid" style={{ margin: 0, padding: 0, paddingTop }}>
        <div className="col-12" style={{ height: '100%' }}>
          <img alt="Logo" src={logo} style={{ maxWidth: max, maxHeight: max }} />
        </div>
      </div>
    </Container>
  );
}
