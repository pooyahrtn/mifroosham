import React, { Component } from 'react';
import {Root as NativeRoot}  from "native-base";
import {AsyncStorage, View, Text, Platform, StyleSheet, PixelRatio, Button, Image} from 'react-native';
import ReviewPage from './components/ReviewPage.js';
import Main from './components/main.js';
import SoldPage from './components/SoldPage.js';
import BoughtPage from './components/BoughtPage.js';
import PostDetailPage from './components/postDetailPage.js';
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
import {TabNavigator , StackNavigator, NavigationActions} from 'react-navigation';
import {Icon} from 'react-native-elements'
import {NavigationComponent} from 'react-native-material-bottom-navigation'
import SInfo from 'react-native-sensitive-info';
import {addFocusedNotification} from './actions/notificationActions.js';
import CommentPage from './components/commentsPage.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


const InboxTabPage = TabNavigator({
  SoldPage:{
    screen: SoldPage,
  },
  BoughtPage: {
    screen: BoughtPage,
  }

}, {


  tabBarPosition: 'top',

  tabBarOptions: {
     showIcon :true,
     shifting : true,
     activeTintColor : 'black',
     inactiveTintColor: '#707070',
     labelStyle: {
      fontSize: 16,
      fontWeight:'bold'
    },
     style: {
      backgroundColor: '#F5F5F5',
    },
    indicatorStyle : {
      backgroundColor:'#707070'
    }
   }

});

const MyApp = TabNavigator({
  Main: {
    screen: Main,
  },

  HistoryPage:{
    screen: HistoryPage,
  },
  ProfilePage:{
    screen: ProfilePage,
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
       },
       ProfilePage: {
         icon : <Icon size={24} color="#BDBDBD" name="account-box" />,
         activeIcon : <Icon size={24} color="#455A64" name="account-box" />
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
  },
  InboxTabPage:{
    screen: InboxTabPage
  },
  CommentPage:{
    screen: CommentPage,
  },
  OtherProfilePage:{
    screen: ProfilePage,
  },
  ReviewPage:{
    screen: ReviewPage
  },
  PostDetailPage:{
    screen: PostDetailPage
  }

}

const Navigator = ({ initialRouteName }) => {
  const stackNavigatorConfigs = {
    initialRouteName,
    headerMode:'none'
  };
  const CustomNavigator = StackNavigator(routeConfigs, stackNavigatorConfigs);
  return (<NativeRoot><CustomNavigator  /></NativeRoot>);
};

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

  componentWillMount(){
    SInfo.getItem('token', {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham'}).then(value => {
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
    });

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
      console.log("notification received:  ",notification);
    }

    onOpened(openResult) {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData.transaction_uuid);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
      addFocusedNotification(openResult.notification.payload.additionalData.transaction_uuid)
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    //TODO: it means user notification token is not saved when user first sign up or login
    onIds(device) {
      if(this.state.logged){
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


function mapStateToProps(state){
  return {}
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({addFocusedNotification}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
