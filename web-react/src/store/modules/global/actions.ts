export function loading(): any {
  return {
    type: '@global/LOADING',
  };
}

export function loadingSuccess(): any {
  return {
    type: '@global/LOADING_SUCCESS',
  };
}

export function showFilter(): any {
  return {
    type: '@global/SHOW_FILTER',
  };
}

export function hideFilter(): any {
  return {
    type: '@global/HIDE_FILTER',
  };
}

export function expiringToken(): any {
  return {
    type: '@global/TOKEN_EXPIRING',
  };
}

export function validToken(): any {
  return {
    type: '@global/TOKEN_VALID',
  };
}
