export default function(state= null, action){
  switch (action.type) {
    case "User_Selected": return action.payload;
      break;
  }
  return state;
}
