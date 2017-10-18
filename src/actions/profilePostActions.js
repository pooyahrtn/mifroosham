
export const LOAD_MORE_PROFILE_POST = 'LOAD_MORE_PROFILE_POST';
export const INIT_PROFILE_POST = 'INIT_PROFILE_POST';
export const UPDATE_PROFILE_POST = 'UPDATE_PROFILE_POST';


export const initProfilePost = (username, data) => {
  return {
    type : INIT_PROFILE_POST,
    payload: {data, username}
  }
}
export const loadMoreProfilePost = (username, data)=>{
  return {
    type : LOAD_MORE_PROFILE_POST,
    payload: {data, username}
  }
}

export const updateProfilePost = (username, postContainer)=>{
  return {
    type : UPDATE_PROFILE_POST,
    payload: {postContainer, username}
  }
}
