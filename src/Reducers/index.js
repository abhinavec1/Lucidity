import { combineReducers } from 'redux';

// Reducers

const inventoryDataInitialState = {
  totalProducts: 0,
  totalStoreValue: 0,
  outOfStock: 0,
  categoryCount: 0,
  items: []
}

const userInitialState = {
  role: 'admin'
}

const inventoryDataReducer = (state= inventoryDataInitialState, action) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        totalProducts: action.payload.totalProducts,
        totalStoreValue: action.payload.totalStoreValue,
        outOfStock: action.payload.outOfStock,
        categoryCount: action.payload.categoryCount,
        items: [...action.payload.items]
      };
    default:
      return state;
  }
}

const userReducer = (state= userInitialState, action) => {
  switch (action.type) {
    case 'UPDATE-ROLE':
      return {
        ...state,
        role: action.payload.userRole
      };
    default:
      return state;
  }
}

// Combine Reducers
const rootReducer = combineReducers({
  inventoryData: inventoryDataReducer,
  user: userReducer
});

export default rootReducer;