import { UPDATE_POST_SEARCH, INIT_POST_SEARCH, LOAD_MORE_POST_SEARCH} from '../actions/PostSearchActions.js'



export default function PostSearchReducer(state=[], action){
  switch (action.type) {
    case INIT_POST_SEARCH:{
      data = action.payload
      return data;
    }
    case LOAD_MORE_POST_SEARCH:{
      return [...state, ...action.payload]
    }
    case UPDATE_POST_SEARCH:{
      data = state
      for (var i = 0; i < data.length; i++) {
        if(data[i].uuid === action.payload.uuid){
          data[i] = {...data[i], ...action.payload}
          break;
        }
      }
      return data;
    }
    break;
  }
  return state;
}
