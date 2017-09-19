import React, { Component } from 'react';
import {Root as NativeRoot}  from "native-base";
import {AsyncStorage, View, Text, Platform, StyleSheet, PixelRatio, Button, Image} from 'react-native';
import Welcome from './components/welcome.js';
import Main from './components/main.js';
import Root from './components/root.js';
import RepoList from './components/repolist.js';
import InboxPage from './components/inboxPage.js';
import ProfilePageWithHeader from './components/profilePageWithHeader.js';
import TakePhotoPage from './components/takePhotoPage.js';
import NewPostPage from './components/newPostPage.js';
import BuyItemPage from './components/buyItemPage.js';
import Authentication from './components/authenticationPage.js';
import NewProfilePage from './components/newProfilePage.js';
import confirmationPage from './components/confirmationPage.js';
import ProfilePage from './components/profilePage.js';
import HistoryPage from './components/historyPage.js';
import OneSignal from 'react-native-onesignal';
import {my_notification_url} from './serverAddress.js'
import {TabNavigator , StackNavigator} from 'react-navigation';
import {Icon} from 'react-native-elements'
import {NavigationComponent} from 'react-native-material-bottom-navigation'




const MyApp = TabNavigator({
  Main: {
    screen: Main,
  },

  HistoryPage:{
    screen: HistoryPage,
  }

}, {

  tabBarComponent:NavigationComponent,
  tabBarPosition: 'bottom',

  tabBarOptions: {
   bottomNavigationOptions: {
     rippleColor: '#BDBDBD',
     barBackgroundColor: 'white',
     activeLabelColor : '#455A64',
     style:{
      borderTopWidth: .75,
      borderColor: '#EEEEEE',
      elevation: 1,
    },
     shifting : true,
     tabs: {
       Main: {
         icon : <Icon size={24} color="#BDBDBD" name="home" />,
         activeIcon : <Icon size={24} color="#455A64" name="home" />
       },
       HistoryPage: {
         icon : <Icon size={24} color="#BDBDBD" name="history" />,
         activeIcon : <Icon size={24} color="#455A64" name="history" />
       }
     }
   }
 }

});
const routeConfigs = {
  Authentication: {
    screen: Authentication,
  },
  ConfirmationPage : {
    screen: confirmationPage,
  },
  NewProfilePage:{
    screen: NewProfilePage,
  },
  MyApp :{
    screen : MyApp
  },
  TakePhotoPage:{
    screen: TakePhotoPage
  },
  NewPostPage:{
    screen: NewPostPage
  },
  BuyItemPage:{
    screen: BuyItemPage,
  }

}

const Navigator = ({ initialRouteName }) => {
  const stackNavigatorConfigs = {
    initialRouteName,
    headerMode:'none'
  };
  const CustomNavigator = StackNavigator(routeConfigs, stackNavigatorConfigs);
  return (<NativeRoot><CustomNavigator /></NativeRoot>);
};

export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      init_loading: true,
      token : null,
    };
    this.onIds = this.onIds.bind(this)
  };

  componentWillMount(){
    AsyncStorage.getItem('@Token:key')
    .then( (value) =>{
        if (value != null){
          this.setState({
            logged: true,
            init_loading: false,
            token : value
          });
          // this.props.tokenReceived(value)
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

    //TODO: it means user notification token is not saved when user first sign up or login
    onIds(device) {
      if(this.state.logged){fetch(my_notification_url
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
        });}

  }
  initRout = ()=>{
    if (this.state.logged) {
      return 'MyApp'
    }else {
      return 'Authentication'
    }
  }
  render(){
    if(this.state.init_loading){
      return <View></View>
    }
    return(

      Navigator({initialRouteName : this.initRout()})
    );
  }
}
