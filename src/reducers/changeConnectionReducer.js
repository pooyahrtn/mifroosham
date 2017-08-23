export default function(state= false, action){
  switch (action.type) {
    case 'CHANGE_CONNECTION_STATUS': return action.payload;
      break;
  }
  return state;
}
