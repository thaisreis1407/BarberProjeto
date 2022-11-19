import styled from 'styled-components';

export const ContainerGrid = styled.div`
  .p-paginator-pages {
  }
  .p-paginator-element {
    width: 0px;
  }
  .p-paginator-current {
  }

  @media (min-width: 40em) {
    .p-paginator-current {
      float: left;
    }
    .p-paginator {
      text-align: right;
      padding-right: 10px;
      padding-left: 10px;
    }
  }
`;
