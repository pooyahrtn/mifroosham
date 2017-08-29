var gitRepos= [];
export function GitReducer(state=gitRepos, action){
  switch (action.type) {
    case "Get_Repos": { gitRepos = action.payload;
      return gitRepos;
    }
      break;
  }
  return gitRepos;
}
