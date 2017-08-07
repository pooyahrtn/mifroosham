import {me, matin, kia, bahram} from '../myProfileData.js'

export function getRepos(response) {
  return{
    type: 'Get_Repos',
    payload: response
  }
}

export function getRepoThunk() {
  return function(dispatch, getState) {
    fetch('https://api.github.com/repositories')
    .then(e => e.json())
      .then(function(response){
        console.log(response);
        var arr = response.slice(0,10);
        dispatch(getRepos(arr))
      }).catch((error) => {
           console.error(error,"ERRRRRORRR");
       });
  }
}

export function repoSelected(repo){
  return{
    type: 'Repo_Selected',
    payload: repo
  }
}

export function getPendingNotificationsThunk(){
  return function(dispatch, getState) {
    var arr = [
      {
        id:1,
        type:'sell',
        end_time: 1501914468,
        buyer : {
          full_name: 'سید متین گشتایی',
          avatar_url: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAlIAAAAJDIyZjA0NDlkLTYzMzMtNDc5Yy1hOTE1LTQwMjQ2YzFhZmRlYw.jpg',
          phone_number: '09129994444'
        },
        title: 'کتاب بتن مصطفی نژاد',
        time: 1501698343,
        image_url: "http://shop-civil.ir/8880-large_default/shop-civil.jpg",
        image_height_to_width_ratio: 1.1,

      },
      {
        id:2,
        type:'buy',
        end_time: 1501954468,
        buyer : {
          full_name: 'کیا گالری',
          avatar_url: 'http://hamgardi.com/H_Images/s_9839/2l563F/%D8%B7%D9%84%D8%A7%D9%81%D8%B1%D9%88%D8%B4%DB%8C-%DA%A9%DB%8C%D8%A7-%DA%AF%D8%A7%D9%84%D8%B1%DB%8C--KIA-GALLERY--14010-%D9%87%D9%85%DA%AF%D8%B1%D8%AF%DB%8C.jpg',
          phone_number: '09129994444'
        },
        title: 'انگشتر کیا ۳۲۳',
        time: 1501688343,
        image_url: "http://kia-gallery.com/Images/Product/GProduct_2372.jpg",
        image_height_to_width_ratio: 1.1,

      },
      {
        id:3,
        type:'deliver',
        buyer : {
          avatar_url: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAO0AAAAJGNlNTA4M2M0LTNlNTMtNDVhNi1iM2VmLTYzZjY4MjU0ZjI3Mg.jpg",
          phone_number: '09124594688',
          full_name: "پویا هراتیان",
        },
        title:'لپتاپ لنوو kd643',
        time: 1501588343,
        image_url: "http://images.pcworld.com/images/article/2011/06/lenovo-ideapad-b570-back-5190114.jpg",
        image_height_to_width_ratio: 1.1,

      },
    ];
    dispatch(getPendingNotifications(arr))
  }
}

export function getPendingNotifications(response){
  return {
      type: 'Get_PendingNotifications',
      payload: response
    }
}

export function getRecentHistoryThunk(){
  return function(dispatch, getState) {
    var arr = [
      {
        id: 0,
        type:'like',
        time: 1501698343,
        user : {
          full_name: 'سید متین گشتایی',
          avatar_url: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAlIAAAAJDIyZjA0NDlkLTYzMzMtNDc5Yy1hOTE1LTQwMjQ2YzFhZmRlYw.jpg',
        },
        title: 'کتاب بتن مصطفی نژاد',
        image_url: "http://shop-civil.ir/8880-large_default/shop-civil.jpg",
        image_height_to_width_ratio: 1.1,
      },
      {
        id: 1,
        type:'follow',
        time: 1501699243 ,
        user : {
          full_name: 'کیا گالری',
          avatar_url: 'http://hamgardi.com/H_Images/s_9839/2l563F/%D8%B7%D9%84%D8%A7%D9%81%D8%B1%D9%88%D8%B4%DB%8C-%DA%A9%DB%8C%D8%A7-%DA%AF%D8%A7%D9%84%D8%B1%DB%8C--KIA-GALLERY--14010-%D9%87%D9%85%DA%AF%D8%B1%D8%AF%DB%8C.jpg',
        },

      },
      {
        id: 2,
        type:'share',
        time: 1501699323,
        user : {
          full_name: 'سید متین گشتایی',
          avatar_url: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAlIAAAAJDIyZjA0NDlkLTYzMzMtNDc5Yy1hOTE1LTQwMjQ2YzFhZmRlYw.jpg',
        },
        title: 'لپتاپ لنوو k342',
        image_url: "http://images.pcworld.com/images/article/2011/06/lenovo-ideapad-b570-back-5190114.jpg",
        "image_height_to_width_ratio": 0.64,

      },
    ];
    dispatch(getRecentHistory(arr))
  }
}

export function getRecentHistory(response){
  return {
      type: 'Get_RecentHistory',
      payload: response
    }
}

export function getUserThunk(user_id){
  return function(dispatch, getState) {
    if (user_id === 0) {
      var user = me;
    }else if (user_id === 1) {
      var user = matin;
    }else if (user_id === 2) {
      var user = kia;
    }else if (user_id === 3) {
      var user = bahram;
    }
    dispatch(getUser(user))
  }
}

export function getUser(response){
  return {
      type: "Get_User",
      payload: response
    }
}

export function userSelected(user_id){
  return{
    type: 'User_Selected',
    payload: user_id
  }
}

export function capturedImagePath(image_path){
  return{
    type: 'Captured_Image_Path',
    payload: image_path
  }
}

export function tabSelected(tab){
  return{
    type: 'Tab_Selected',
    payload: tab
  }
}
