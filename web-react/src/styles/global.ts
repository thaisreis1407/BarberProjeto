/**
 * Módulo Global de Styles contendo definições do styled-components que serão usadas em toda a aplicação.
 * @module Global
 * @category Styles
 */

import styled, { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *:focus {
    outline: 0;
  }

  .p-sidebar-content{
    padding: 1px !important;
  }

  .p-button-label {
    font-weight: normal;
  }

  th {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }

  td {
    padding-left: 4px !important;
    padding-right: 4px !important;
    padding-top: 3px !important;
    padding-bottom: 3px !important;
  }

  .container-page {
    /* margin-top: 50px; */
    padding: 65px 12px 6px 12px ;
    min-height: 100vh;
    background-color: #fff;
  }

  //layout
  @media (max-width: 62em) {
  .layout-main-container {
      margin-left: 0px !important;
      padding-left: .7rem !important;
      padding-top: 80px !important;
      padding-right: 10px;
      height: calc(100vh - 7.0rem);
    }
  }

  @media (min-width: 62em) {
    /* .container-page {
      padding: 6px 12px 6px 12px !important;
      min-height: calc(100vh - 7.0rem);
    } */

    .layout-main-container {
      margin-left: 260px !important;
      padding-top: 80px !important;
      padding-right: 10px;
      height: calc(100vh - 7.0rem);
    }

    .layout-sidebar {
      left: 8px !important;
      top: 80px!important;
      height: calc(100vh - 7.0rem);
    }

    .layout-static-sidebar-inactive {
      .layout-sidebar {
        left: 0px !important;
      }

      .layout-main-container {
        margin-left: 0px !important;
        padding-left: .7rem !important;
      }
    }
  }




  @media print {
    .pagebreak {
      break-after: always !important;
      page-break-after: always !important;
       page-break-inside: avoid !important;
      display: block;
    }

    display: block;
    button,
    input,
    .p-dropdown,
    .p-calendar,
    label,
    hr, .layout-sidebar {
      display: none !important;
    }
  }

  html, body, #root {
    height: 100%;
  }

  form {
    width: 100%;
  }

  body {
    --webkit-font-smoothing: antialiased;
  }

  body, input, button, label {
    font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  //tdata grid
  .p-datatable .p-datatable-thead > tr > th {
    padding-left: 4px !important;
    padding-right: 4px !important;
    padding: 8px;
  }

  td {
    padding-left: 4px !important;
    padding-right: 4px !important;
    padding-top: 3px !important;
    padding-bottom: 3px !important;
  }

  .p-paginator {
    padding: 0px;
  }

  .p-paginator .p-paginator-pages .p-paginator-page {
    min-width: 2rem;
    height: 2rem;

  }


  .datatable-doc-demo .p-paginator .p-paginator-current {
    margin-left: auto;
  }

  .blink-animated {
    animation: blink-animation 2s steps(5, start) infinite;
    -webkit-animation: blink-animation 2s steps(5, start) infinite;
  }
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }

  .botao-pequeno {
    width: 26px !important;
    height: 26px !important;
  }

  .botao-pequeno-largo {
    width: 40px !important;
    height: 26px !important;
  }

  .label-button {
    display: block;
  }

  /* Show priority 3 at 640px (40em x 16px) */
  @media (max-width: 40em) {
    .desktop-screen {
      display: none;
    }
  }

  /* Show priority 3 at 640px (40em x 16px) */
  @media (min-width: 40em) {
    .mobile-screen {
      display: none;
    }
  }

  /* Show priority 3 at 640px (40em x 16px) */
  @media (max-width: 40em) {
    .label-button {
      visibility: hidden;
      height: 0px;
    }
  }

  /* formatacao para colunas da grid */
  .grid-col-id {
    width: 58px;
    text-align: left;
    font-size: 13px;
  }

  .grid-col-id-g {
    width: 68px;
    text-align: left;
    font-size: 13px;
  }

  .grid-col-data-hora {
    width: 120px;
    text-align: left;
    font-size: 13px;
  }
  .grid-col-data {
    width: 80px;
    text-align: left;
    font-size: 13px;
  }
  .grid-col-hora {
    width: 63px;
    text-align: left;
    font-size: 13px;
  }

  .grid-col-nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .grid-col-id-g {
    width: 90px;
    text-align: left;
    font-size: 13px;
  }

  .unresize {
    resize: none;
  }

  .grid-col-curr {
    width: 120px;
    text-align: end !important;
    font-size: 13px;
  }

  .grid-col-val {
    width: 90px;
    text-align: end !important;;
    font-size: 13px;
  }


  .grid-col-tel {
    width: 120px;
    font-size: 13px;
  }


  .grid-col-center {
    text-align: center !important;
  }

  .gid-col-acoes-35 {
    width: 35px;
    text-align: end !important;
    font-size: 13px;
  }
  .gid-col-acoes-70 {
    width: 70px;
    text-align: end !important;
    font-size: 13px;
  }

  .grid-col {
    font-size: 13px;
    @media screen and (max-width: 960px) {
      text-align: left !important;
    }
  }

  /* div flex-grid */
  .p-margin-padding-0 {
    padding: 0 !important;
    margin: 0 !important;
  }

  .p-margin-0 {
    /* padding: 0 !important; */
    margin: 0 !important;
  }
  .p-padding-0 {
    /* padding: 0 !important; */
    padding: 0 !important;
  }


  /*configurações do block-ui*/

  .loading-indicator {
    text-align: center;
  }
  .block-ui-overlay {
  animation: 1s fadein 0.5s both;
  /* wait 1s, fadein over .5s, apply the animation styles both before and after. */
  }

  @keyframes fadein {
    from {
      opacity: 0.1;
    }
    to {
      opacity: 0.5;
    }
  }
  /*fim das configurações do block-ui*/

`;

// export const Label = styled.label`
//   font-weight: bold;
// `;

export const ContainerBase = styled.div`
  margin: 0 !important;
  padding: 0 !important;
`;
