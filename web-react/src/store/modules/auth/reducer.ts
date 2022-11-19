/* eslint-disable default-param-last */
import produce from 'immer';

const INITIAL_STATE = {
  token: null,
  signed: false,
  loaind: false,
};

export default function auth(state: any = INITIAL_STATE, action: any): any {
  return produce(state, (draft: any) => {
    switch (action.type) {
      case '@auth/LOGIN_REQUEST': {
        draft.loading = true;
        break;
      }

      case '@auth/LOGIN_SUCCESS': {
        draft.token = action.payload.token;
        draft.decodedToken = action.payload.decodedToken;
        draft.signed = true;
        draft.loading = false;
        break;
      }
      case '@auth/LOGIN_FAILURE': {
        draft.loading = false;
        break;
      }
      case '@auth/LOGOUT': {
        draft.token = null;
        draft.decodedToken = null;
        draft.signed = false;
        break;
      }
      default:
    }
  });
}
