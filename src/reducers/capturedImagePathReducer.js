export default function(state= null, action){
  switch (action.type) {
    case "Captured_Image_Path": return action.payload;
      break;
  }
  return state;
}
