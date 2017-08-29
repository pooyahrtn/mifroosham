export default function(state= null, action){
  switch (action.type) {
    case "Token_Reducer": return action.payload;
      break;
  }
  return state;
}
