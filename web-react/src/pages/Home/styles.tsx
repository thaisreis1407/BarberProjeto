import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  justify-content: center;

  .logo-speedy {
    text-align: center;
    margin-bottom: 5px;
    margin-right: 5px;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 2;
    overflow: hidden;
    padding: 5px;
    width: 200px;

    img {
      width: 175px;
      height: auto;
      margin: 0;
      padding: 0;
    }

    a,
    span {
      display: block;
      font-size: 13px;
      font-weight: normal;

      line-height: 1;
    }
  }

  /* Show priority 3 at 640px (40em x 16px) */
  @media (max-width: 40em) {
    .logo-speedy {
      display: none;
    }
  }

  iframe {
    height: calc(100vh - 40px);
    width: '100%';
  }
  min-height: 100% !important;
  .p-dialog {
    max-height: 99% !important;
  }
  .p-dialog-titlebar {
    margin: 0px !important;
    padding: 2px !important;
  }
  /* .p-dialog-titlebar-close-icon {
    font-size: 19px !important;
  } */

  .p-dialog-titlebar-icon {
    width: 35px !important;
    text-align: center;
  }
`;
