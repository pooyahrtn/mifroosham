import {INIT_USERNAME_SEARCH, LOAD_MORE_USERNAME_SEARCH} from '../actions/UsernameSearchActions.js'


export default function UsernameSearchReducer(state=[], action){
  switch (action.type) {
    case INIT_USERNAME_SEARCH:{
      data= action.payload
      return data;
    }
    case LOAD_MORE_USERNAME_SEARCH:{
      return [...state, ...action.payload]
    }
 
    break;
  }
  return state;
}
