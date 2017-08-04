var recentHistory= [];
export default function(state=recentHistory, action){
  switch (action.type) {
    case "Get_RecentHistory": { recentHistory = action.payload;
      return recentHistory;
    }
      break;
  }
  return recentHistory;
}
