/* eslint-disable default-param-last */
import produce from 'immer';

const INITIAL_STATE = {
  loading: false,
  filterVisible: false,
  tokenExpiring: false,
};

export default function global(state = INITIAL_STATE, action: any): any {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@global/LOADING': {
        draft.loading = true;
        break;
      }

      case '@global/LOADING_SUCCESS': {
        draft.loading = false;
        break;
      }

      case '@global/SHOW_FILTER': {
        draft.filterVisible = true;
        break;
      }

      case '@global/HIDE_FILTER': {
        draft.filterVisible = false;
        break;
      }

      case '@global/TOKEN_EXPIRING': {
        draft.tokenExpiring = true;
        break;
      }

      case '@global/TOKEN_VALID': {
        draft.tokenExpiring = false;
        break;
      }

      default:
    }
  });
}
