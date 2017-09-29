
export const LOAD_MORE = 'LOAD_MORE';
export const INIT_FEEDS = 'INIT_FEEDS';
export const UPDATE_POST = 'UPDATE_POST'


export const initData = (data) => {
  return {
    type : INIT_FEEDS,
    payload: data
  }
}
export const loadMore = (data)=>{
  return {
    type : LOAD_MORE,
    payload: data
  }
}

export const updatePost = (post)=>{
  return {
    type : UPDATE_POST,
    post
  }
}
