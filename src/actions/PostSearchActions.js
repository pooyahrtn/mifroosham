export const INIT_POST_SEARCH = 'INIT_POST_SEARCH';
export const LOAD_MORE_POST_SEARCH = 'LOAD_MORE_POST_SEARCH';
export const UPDATE_POST_SEARCH = 'UPDATE_POST_SEARCH';

export const initPostSearch = (data) => {
  return {
    type : INIT_POST_SEARCH,
    payload: data
  }
}
export const loadMorePostSearch = (data)=>{
  return {
    type : LOAD_MORE_POST_SEARCH,
    payload: data
  }
}

export const updatePostSearch = (post)=>{
  return {
    type : UPDATE_POST_SEARCH,
    payload : post
  }
}
