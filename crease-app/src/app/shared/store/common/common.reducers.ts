import { CommonState } from './common.states';

const initialState: CommonState = {
  isBackHeader: false,
  titleCustom: '',
  listMenu: [],
  shopInfo: null,
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
    case 'SET_MENU': {
      return {
        ...state,
        listMenu: action.payload,
      };
    }
    case 'SET_SHOP_INFO': {
      return {
        ...state,
        shopInfo: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
