import { UPDATE_PROFILE_POST, INIT_PROFILE_POST, LOAD_MORE_PROFILE_POST} from '../actions/profilePostActions.js'
import {REHYDRATE} from 'redux-persist/constants'


export default function feedsReducer(state=[], action){
  switch (action.type) {
    case INIT_PROFILE_POST:{
      data= action.payload
      return data;
    }
    case LOAD_MORE_PROFILE_POST:{
      return [...state, ...action.payload]
    }
    case UPDATE_PROFILE_POST:{
      data = state
      for (var i = 0; i < data.length; i++) {
        if(data[i].post.uuid === action.post.uuid){
          data[i].post = action.post
        }
      }
      return data;
    }
    case REHYDRATE:{
      const savedData = action.payload.profilePostReducer || state;
      return [...state, ...savedData];
    }
    break;
  }
  return state;
}
