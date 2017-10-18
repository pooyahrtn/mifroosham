export const INIT_USERNAME_SEARCH = 'INIT_USERNAME_SEARCH';
export const LOAD_MORE_USERNAME_SEARCH = 'LOAD_MORE_USERNAME_SEARCH';


export const initUsernameSearch = (data) => {
    return {
      type : INIT_USERNAME_SEARCH,
      payload: data
    }
  }

export const loadMoreUsernameSearch = (data)=>{
    return {
        type : LOAD_MORE_USERNAME_SEARCH,
        payload: data
    }
}


  