import {INIT_SOLD_TRANSACTIONS, LOAD_MORE_SOLD_TRANSACTIONS, UPDATE_SOLD_TRANSACTION, DELETE_SOLD_TRANSACTION} from '../actions/transactionsActions.js'
import {REHYDRATE} from 'redux-persist/constants'



export default function (state=[], action){
  switch (action.type) {
    case INIT_SOLD_TRANSACTIONS:{
      data= action.payload
      return data;

    }
    case LOAD_MORE_SOLD_TRANSACTIONS:{
      return [...state, ...action.payload]
    }
    case UPDATE_SOLD_TRANSACTION:{
      data = state
      for (var i = 0; i < data.length; i++) {
        if(data[i].uuid === action.payload.uuid){
          data[i] = action.payload
        }
      }
      return data;
    }
    case DELETE_SOLD_TRANSACTION:{
      data = state
      index = data.findIndex((item) => item.uuid === transaction.uuid);
      data.splice(index,1)
      return data
    }
    case REHYDRATE:{
      const savedData = action.payload.soldTransactionsReducer || state;
      return [...state, ...savedData];

    }
    default:
      return state;
  }

}
