import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import {AsyncStorage, View, Text} from 'react-native';
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
import ConfirmationPage from './components/confirmationPage.js';


export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      init_loading: true,
    };
  };
  //
  componentWillMount(){
    AsyncStorage.getItem('@Token:key')
    .then( (value) =>{
        if (value != null){
          this.setState({
            logged: true,
            init_loading: false,
          });
        } else{
          this.setState({
            init_loading: false,
          })
        }
      }
    );
  };
  render(){
    if(this.state.init_loading){
      return <View></View>
    }
    return(
      <Router hideNavBar= {true}>
        <Scene key="root" hideNavBar= {true}>
          <Scene
             component={Authentication}
             key='authenticationPage'
             title='Authentication'
             initial={!this.state.logged}
           />
          <Scene key="confirmationPage" component={ConfirmationPage} />
          <Scene key="newProfilePage" component={NewProfilePage} />
          <Scene key="frame" component={Root} initial = {this.state.logged}/>
          <Scene key="inbox" title="inbox" component={InboxPage}/>
          <Scene key="profilePage" component={ProfilePageWithHeader}/>
          <Scene key="takePhotoPage" component={TakePhotoPage}/>
          <Scene key="newPostPage" component={NewPostPage} />
        </Scene>
      </Router>
    );
  }
}
