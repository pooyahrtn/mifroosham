export const INIT_BOUGHT_TRANSACTIONS = 'INIT_BOUGHT_TRANSACTIONS'
export const LOAD_MORE_BOUGHT_TRANSACTIONS = 'LOAD_MORE_BOUGHT_TRANSACTIONS'
export const UPDATE_BOUGHT_TRANSACTION = 'UPDATE_BOUGHT_TRANSACTION'
export const DELETE_BOUGHT_TRANSACTION = 'DELETE_BOUGHT_TRANSACTION'

export const INIT_SOLD_TRANSACTIONS = 'INIT_SOLD_TRANSACTIONS'
export const LOAD_MORE_SOLD_TRANSACTIONS = 'LOAD_MORE_SOLD_TRANSACTIONS'
export const UPDATE_SOLD_TRANSACTION = 'UPDATE_SOLD_TRANSACTION'
export const DELETE_SOLD_TRANSACTION = 'DELETE_SOLD_TRANSACTION'


export const initBoughtData = (data) => {
  return {
    type : INIT_BOUGHT_TRANSACTIONS,
    payload: data
  }
}
export const loadBoughtMore = (data)=>{
  return {
    type : LOAD_MORE_BOUGHT_TRANSACTIONS ,
    payload: data
  }
}

export const updateBoughtTransaction = (post)=>{
  return {
    type : UPDATE_BOUGHT_TRANSACTION,
    post
  }
}

export const deleteBoughtTransaction = (post)=>{
  return {
    type : DELETE_BOUGHT_TRANSACTION,
    post
  }
}

export const initSoldData = (data) => {
  return {
    type : INIT_SOLD_TRANSACTIONS,
    payload: data
  }
}
export const loadSoldMore = (data)=>{
  return {
    type : LOAD_MORE_SOLD_TRANSACTIONS ,
    payload: data
  }
}

export const updateSoldTransaction = (post)=>{
  return {
    type : UPDATE_SOLD_TRANSACTION,
    post
  }
}

export const deleteSoldTransaction = (post)=>{
  return {
    type : DELETE_SOLD_TRANSACTION,
    post
  }
}
