import {bought_transactions_url, sold_transactions_url, transaction_notifications_url,
  read_transaction_notifications, post_comments_url, send_comment_url, posts_url, report_comment_url,
  read_feeds_url, base_url, user_posts, update_profile_photo_url,follow_user_url, user_reviews_url } from './serverAddress.js'

function basicGet(url, token, onSuccess, onFailed ){
  fetch(url,
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
    .then(onSuccess)
    .catch(onFailed);
}

function basicPaginatedGet(page, url, token, onSuccess, onFailed){
  return basicGet(url+'/'+'?page='+page, token, onSuccess, onFailed)
}

function basicPost(url, body, token, onSuccess, onFailed){
  fetch(url,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(body)
    }
  )
    .then(res => res.json())
    .then(onSuccess)
    .catch(onFailed);
}
function basicPut(url, body, token, onSuccess, onFailed){
  fetch(url,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(body)
    }
  )
    .then(res => res.json())
    .then(onSuccess)
    .catch(onFailed);
}

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
  return basicPost(read_transaction_notifications, {}, token, onSuccess, onFailed)
}


export function loadPostComments(page, post_uuid, token, onSuccess, onFailed){
  return basicPaginatedGet(page, post_comments_url+post_uuid.toString(), token, onSuccess, onFailed)
}

export function sendComment(token, post_uuid, comment, onSuccess, onFailed){
  body = {post_uuid, comment}
  return basicPost(send_comment_url, body, token, onSuccess, onFailed)
}

export const updatePost = (token, post_uuid, onSuccess, onFailed)=>{
  return basicGet(posts_url+post_uuid.toString()+'/',  token, onSuccess, onFailed)
}

export const reportComment = (token, comment_uuid, status, onSuccess, onFailed) => {
  return basicPost(report_comment_url, {comment_uuid, status}, token, onSuccess, onFailed)
}

export const userPosts = (token, page, username, onSuccess, onFailed) => {
  return basicGet(user_posts+username+'/?page='+ page, token, onSuccess, onFailed)
}

export const userDetail = (token, username, onSuccess, onFailed) =>{
  return basicGet(base_url+username+'/', token, onSuccess, onFailed)
}

export function updateProfilePhoto(token, image, onSuccess, onFailed){
  const file = {
    uri : image.path,
    name : 'profile.jpg',
    type: 'image/jpg'
  }
  let formdata = new FormData();
  formdata.append('avatar_url', file)
  fetch(update_profile_photo_url
  ,
     {
       method: 'PUT',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'multipart/form-data',
         'Authorization': 'Token ' + token,
       },
       body: formdata
     }
   )
    .then((response) => {
      return response.json()
    })
    .then(onSuccess)
    .catch(onFailed);
}

export function followUser(token, username, onSuccess, onFailed){
  return basicPut(follow_user_url+username, {}, token, onSuccess, onFailed)
}

export const userReviews = (token, page, username, onSuccess, onFailed) => {
  return basicGet(user_reviews_url+username+'/?page='+ page, token, onSuccess, onFailed)
}
