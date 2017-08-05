import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Welcome from './components/welcome.js';
import Main from './components/main.js';
import Root from './components/root.js';
import RepoList from './components/repolist.js';
import InboxPage from './components/inboxPage.js';
import ProfilePageWithHeader from './components/profilePageWithHeader.js';


export default class App extends Component{
  render(){
    return(
      <Router hideNavBar= {true}>
        <Scene key="root" hideNavBar= {true}>
          <Scene key="frame" component={Root} initial={true}/>
          <Scene key="inbox" title="inbox" component={InboxPage}/>
          <Scene key="profilePage" component={ProfilePageWithHeader}/>
        </Scene>
      </Router>
    );
  }
}
