import {me, matin, kia, bahram} from '../myProfileData.js'



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


export function changeConnectionState( status ){
  return { type: 'CHANGE_CONNECTION_STATUS', payload: status };
}
