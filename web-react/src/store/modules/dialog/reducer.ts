/* eslint-disable default-param-last */
import produce from 'immer';

const INICIAL_STATE = {
  config: {
    visible: false,
    title: '',
    body: '',
    handleClose: null,
    loginVisible: false,
    lookupVisible: false,
    lookupConfig: null,
  },
};

export default function dialog(state = INICIAL_STATE, action: any): any {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@dialog/SHOW': {
        draft.config = action.config;
        break;
      }
      case '@dialog/HIDDEN': {
        draft.config = action.config;
        break;
      }

      case '@dialog/SHOW_LOGIN': {
        draft.config = action.config;
        break;
      }
      case '@dialog/HIDDEN_LOGIN': {
        draft.config = action.config;
        break;
      }

      case '@dialog/SHOW_LOOKUP': {
        draft.config = action.config;
        break;
      }
      case '@dialog/HIDDEN_LOOKUP': {
        draft.config = action.config;
        break;
      }

      default:
    }
  });
}
