import { UPDATE_POST, INIT_FEEDS, LOAD_MORE} from '../actions/feedsActions.js'
import {REHYDRATE} from 'redux-persist/constants'


export function feedsReducer(state=[], action){
  switch (action.type) {
    case INIT_FEEDS:{
      data= action.payload
      return data;
    }
    case LOAD_MORE:{
      return [...state, ...action.payload]
    }
    case UPDATE_POST:{
      data = state
      for (var i = 0; i < data.length; i++) {
        if(data[i].post.uuid === action.post.uuid){
          data[i].post = action.post
        }
      }
      return data;
    }
    case REHYDRATE:{
      const savedData = action.payload.feedsReducer || state;
      return [...state, ...savedData];
    }
    break;
  }
  return state;
}
