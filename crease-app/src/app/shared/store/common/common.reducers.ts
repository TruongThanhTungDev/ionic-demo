import { CommonState } from './common.states';

const initialState: CommonState = {
  isBackHeader: false,
  titleCustom: '',
};

export function commonReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'CHANGE_HEADER': {
      return {
        ...state,
        isBackHeader: action.payload.state,
        titleCustom: action.payload.title,
      };
    }
    default: {
      return state;
    }
  }
}
