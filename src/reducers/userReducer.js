
var userInfo = null;
export default function(state=userInfo, action){
  switch (action.type) {
    case "Get_User": { userInfo = action.payload;
      return userInfo;
    }
      break;
  }
  return userInfo;
}
