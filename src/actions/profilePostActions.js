
export const LOAD_MORE_PROFILE_POST = 'LOAD_MORE_PROFILE_POST';
export const INIT_PROFILE_POST = 'INIT_PROFILE_POST';
export const UPDATE_PROFILE_POST = 'UPDATE_PROFILE_POST';


export const initProfilePost = (data) => {
  return {
    type : INIT_PROFILE_POST,
    payload: data
  }
}
export const loadMoreProfilePost = (data)=>{
  return {
    type : LOAD_MORE_PROFILE_POST,
    payload: data
  }
}

export const updateProfilePost = (post)=>{
  return {
    type : UPDATE_PROFILE_POST,
    post
  }
}
