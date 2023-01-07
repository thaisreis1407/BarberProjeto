/* eslint-disable no-return-assign */
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import React, { useCallback } from 'react';

import { montaMenuGrid } from '../utils/utils';

interface IProps {
  handles?: (() => void)[];
  labels?: string[];
  icons?: string[];
  disableds: boolean[];
}

export default function BotaoMenuGrid(props: IProps) {
  const { handles, labels, icons, disableds } = props;

  const montaMenuItem = useCallback(() => {
    return montaMenuGrid(handles, disableds, labels, icons);
  }, [disableds, handles, icons, labels]);

  function renderButtonOp() {
    let menu: any = null;
    return (
      <>
        <Button
          type="button"
          title="Opções"
          className="botao-pequeno p-button-primary"
          icon="pi pi-cog"
          onClick={(event) => {
            if (menu) {
              menu.toggle(event);
            }
          }}
        />
        <Menu
          model={montaMenuItem()}
          popup
          ref={(el) => (menu = el)}
          id="popup_menu"
          appendTo={document.body}
        />
      </>
    );
  }

  return renderButtonOp();
}
