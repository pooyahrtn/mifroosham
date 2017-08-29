var feedsList= [];
var loading = false;
var refreshing = false;
var errors = null;
var next_page = null;
var feedObject = {feedsList, loading, refreshing, errors, next_page};

export default function(state=feedObject, action){
  switch (action.type) {
    case "Init_feeds": {
      feedsList = action.payload;

      return feedObject;
    }
    case "Loading_Feeds":{
      feedObject.loading = true;
      return feedObject;
    }
    case "Refreshing_feeds":{
      feedObject.refreshing = true;
      return feedObject;
    }
      break;
  }
  return feedObject;
}
