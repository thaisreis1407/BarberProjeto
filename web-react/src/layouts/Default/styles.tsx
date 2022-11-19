import styled from 'styled-components';

// import background from '../../assets/images/background-login.png';
// import background from '../../assets/images/logo.png';

export const Wrapper = styled.div`
  min-height: 100%;
  width: 100%;
  /* background-size: contain; */
  /* display: flex; */
  /* flex: 1; */
  /* justify-content: center;
  align-items: stretch; */

  background-color: rgba(0, 0, 0, 0.1);

  .navbar {
    background-color: #4b4b4d;
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100%;

    z-index: 9998;
  }

  .container-nav {
    margin: 0 auto;
    padding-left: 1.25em;
    padding-right: 1.25em;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .navbar-toggle {
    color: #fff;
    cursor: pointer;
  }

  .navebar-titulo {
    color: #fff;
    text-align: center;
    float: center;
    line-height: 30px;
    margin-right: 0px;
    font-style: bold;
    font-size: 25px;
  }

  .navebar-botao {
    float: left;
    margin-right: 5px;
    margin-top: 8px;
  }

  .navebar-botao-right {
    float: right;
    margin-right: 5px;
    margin-top: 8px;
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    z-index: 9999;
    padding: 0;
    background-color: #4b4b4d;
    list-style: none;
    width: 18em;
  }

  .navbar-menu-mobile {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    z-index: 9999;
    padding: 0;
    /*background-color: #3a3633;*/
    list-style: none;
    width: 18em;
  }
`;

export const ContainerMenu = styled.div`
  margin: 0;
  padding: 0;

  .navbar-usuario {
    /*border-bottom: 1px solid #525151;*/
    padding: 15px;
    margin-bottom: 2px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    background: #4b4b4d !important;
    color: #fff;
    cursor: Pointer;
  }

  .navbar-menuitem {
    padding: 15px;
  }

  .navbar-menuitem a {
    color: #ffffff;
    text-decoration: none;
    cursor: Pointer;
  }

  .navbar-menuitem a:hover {
    color: #fff;
  }

  .navbar-menuitem.ativo {
    background-color: #494541;
  }
`;
