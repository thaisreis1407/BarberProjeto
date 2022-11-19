export function showDialog(
  title: string,
  body: any,
  handleClose: () => void,
  arrayButtons: any[]
): any {
  return {
    type: '@dialog/SHOW',
    config: { visible: true, title, body, handleClose, arrayButtons },
  };
}

export function hiddenDialog(): any {
  return {
    type: '@dialog/HIDDEN',
    config: { visible: false, title: '', body: '', handleClose: null, arrayButtons: null },
  };
}

export function showDialogLogin(): any {
  return {
    type: '@dialog/SHOW_LOGIN',
    config: { loginVisible: true },
  };
}

export function hiddenDialogLogin(): any {
  return {
    type: '@dialog/HIDDEN_LOGIN',
    config: { loginVisible: false },
  };
}

export function showLookup(lookupConfig: any): any {
  return {
    type: '@dialog/SHOW_LOOKUP',
    config: { lookupVisible: true, lookupConfig },
  };
}

export function hiddenLookup(): any {
  return {
    type: '@dialog/HIDDEN_LOOKUP',
    config: { lookupVisible: false },
  };
}
