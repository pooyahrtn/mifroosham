import {bought_transactions_url, sold_transactions_url, transaction_notifications_url, read_transaction_notifications} from './serverAddress.js'

export function initBoughtTransactions(token, onSuccess, onFailed){
  fetch(bought_transactions_url,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    }
  )
    .then(res => res.json())
    .then(res => {
      onSuccess(res);
    })
    .catch(error => {
      onFailed(error);
    });
}

export function initSoldTransactions(token, onSuccess, onFailed){
  fetch(bought_transactions_url,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    }
  )
    .then(res => res.json())
    .then(res => {
      onSuccess(res);
    })
    .catch(error => {
      onFailed(error);
    });
}


export function getTransactionNotifications(token, onSuccess, onFailed){
  fetch(transaction_notifications_url,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    }
  )
    .then(res => res.json())
    .then(res => {
      onSuccess(res);
    })
    .catch(error => {
      onFailed(error);
    });
}

export function readNotifications(token, onSuccess, onFailed){
  fetch(read_transaction_notifications,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    }
  )
    .then(res => res.json())
    .then(res => {
      onSuccess(res);
    })
    .catch(error => {
      onFailed(error);
    });
}
