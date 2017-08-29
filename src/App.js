import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import {AsyncStorage, View, Text, Platform} from 'react-native';
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
import OneSignal from 'react-native-onesignal';
import {my_notification_url} from './serverAddress.js'
import {tokenReceived} from './actions/index.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';



class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      init_loading: true,
      token : null,
    };
    this.onIds = this.onIds.bind(this)
  };
  //



  componentWillMount(){
    AsyncStorage.getItem('@Token:key')
    .then( (value) =>{
        if (value != null){
          this.setState({
            logged: true,
            init_loading: false,
            token : value
          });
          this.props.tokenReceived(value)
        } else{
          this.setState({
            init_loading: false,
          })
        }
      }
    );
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);

  };

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
   }

    onReceived(notification) {

    }

    onOpened(openResult) {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
      // console.log('token received : ' + this.props.activeToken);
      fetch(my_notification_url
      ,
         {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Authorization': 'Token ' + this.state.token
           },
           body: JSON.stringify({
             token : device.userId
           })
         }
       )
        .then((response) => {
          // this.setState({loading:false})
          // if (response.status === 200) {
          //   Actions.root()
          // }
          console.log(response);
          return response.json()
        })
        .then((responseJson) => {
          console.log( responseJson);
        })
        .catch((error) => {
          // this.setState({loading:false})
          console.error(error);
        });
  }
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
          <Scene key="frame" component={Root} initial={this.state.logged} />
          <Scene key="inbox" title="inbox" component={InboxPage}/>
          <Scene key="profilePage" component={ProfilePageWithHeader}/>
          <Scene key="takePhotoPage" component={TakePhotoPage}/>
          <Scene key="newPostPage" component={NewPostPage} />
          <Scene key="reposList" component={RepoList}  />
        </Scene>
      </Router>
    );
  }
}
function mapStateToProps(state){
  return{
    activeToken: state.activeToken
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({tokenReceived: tokenReceived }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
