export default function(state= null, action){
  switch (action.type) {
    case "User_Data": return action.payload;
      break;
  }
  return state;
}