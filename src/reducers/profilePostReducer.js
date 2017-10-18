import { UPDATE_PROFILE_POST, INIT_PROFILE_POST, LOAD_MORE_PROFILE_POST} from '../actions/profilePostActions.js'
import {REHYDRATE} from 'redux-persist/constants'


export default function feedsReducer(state={}, action){
  switch (action.type) {
    case INIT_PROFILE_POST:{
      const {username , data} = action.payload
      state[username] = data
      return state
    }
    case LOAD_MORE_PROFILE_POST:{
      const {username , data} = action.payload
      prevData = state[username];
      state[username] = [...prevData, ...data]
      return state;
    }
    case UPDATE_PROFILE_POST:{
      const {username , postContainer} = action.payload
      data = state[username]
      if(!data){
        return state
      }
      for (var i = 0; i < data.length; i++) {
        if(data[i].post.uuid === postContainer.post.uuid){
          data[i] = postContainer
          break
        }
      }
      state[username] = data
      return state;
    }
    case REHYDRATE:{
      const savedData = action.payload.profilePostReducer || state;
      return {...state, ...savedData};
    }
    break;
  }
  return state;
}
