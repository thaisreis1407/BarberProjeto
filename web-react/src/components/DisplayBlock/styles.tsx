import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;

  /* background-color: #000; */
  /* opacity: 20%; */
  @media (max-width: 1024px) {
    .div-icon {
      padding-left: 0 !important;
    }
  }
`;
