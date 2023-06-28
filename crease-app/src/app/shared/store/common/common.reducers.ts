import { CommonState } from './common.states';

const initialState: CommonState = {
  isBackHeader: false,
  titleCustom: '',
  listMenu: [],
  shopInfo: null,
  isReload: false,
  isLoadCompleted: false,
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
    case 'RESET_DATA': {
      return {
        ...state,
        shopInfo: action.payload.shop,
        listMenu: action.payload.listMenu,
      };
    }
    case 'SET_RELOAD': {
      return {
        ...state,
        isReload: action.payload,
      };
    }
    case 'SET_LOADING_COMPLETED': {
      return {
        ...state,
        isLoadCompleted: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
