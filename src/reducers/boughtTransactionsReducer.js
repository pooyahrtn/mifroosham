import {INIT_BOUGHT_TRANSACTIONS, LOAD_MORE_BOUGHT_TRANSACTIONS, UPDATE_BOUGHT_TRANSACTION, DELETE_BOUGHT_TRANSACTION} from '../actions/transactionsActions.js'
import {REHYDRATE} from 'redux-persist/constants'
// IM TRUELY SORRY GUYS :(

export default function (state=[], action){
  switch (action.type) {
    case INIT_BOUGHT_TRANSACTIONS:{
      data= action.payload
      return data;
    }
    case LOAD_MORE_BOUGHT_TRANSACTIONS:{
      return [...state, ...action.payload]
    }
    case UPDATE_BOUGHT_TRANSACTION:{
      data = state
      for (var i = 0; i < data.length; i++) {
        if(data[i].uuid === action.payload.uuid){
          data[i] = action.payload
        }
      }
      return data;
    }
    case DELETE_BOUGHT_TRANSACTION:{
      data = state
      index = data.findIndex((item) => item.uuid === transaction.uuid);
      data.splice(index,1)
      return data
    }
    case REHYDRATE:{
      const savedData = action.payload.boughtTransactionsReducer || state;
      return [...state, ...savedData];

    }
    default:
      return state;
  }

}
