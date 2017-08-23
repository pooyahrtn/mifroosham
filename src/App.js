import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Welcome from './components/welcome.js';
import Main from './components/main.js';
import Root from './components/root.js';
import RepoList from './components/repolist.js';
import InboxPage from './components/inboxPage.js';
import ProfilePageWithHeader from './components/profilePageWithHeader.js';
import TakePhotoPage from './components/takePhotoPage.js';
import NewPostPage from './components/newPostPage.js';
import Authentication from './components/authenticationPage.js';
import NewProfilePage from './components/newProfilePage.js';


export default class App extends Component{
  render(){
    return(
      <Router hideNavBar= {true}>
        <Scene key="root" hideNavBar= {true}>
          <Scene
             component={Authentication}

             key='authenticationPage'
             title='Authentication'
           />
          <Scene key="newProfilePage" component={NewProfilePage}  initial={true}/>
          <Scene key="frame" component={Root}/>
          <Scene key="inbox" title="inbox" component={InboxPage}/>
          <Scene key="profilePage" component={ProfilePageWithHeader}/>
          <Scene key="takePhotoPage" component={TakePhotoPage}/>
          <Scene key="newPostPage" component={NewPostPage} />
        </Scene>
      </Router>
    );
  }
}
