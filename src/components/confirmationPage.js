import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View, Text, StatusBar, TextInput, ActivityIndicator, Alert, AsyncStorage} from 'react-native';
import {Button} from 'react-native-elements';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js';
import {resend_confirmation_code_url, login_url} from '../serverAddress.js'
// import {Actions} from 'react-native-router-flux';
import SInfo from 'react-native-sensitive-info';


async function saveToken(token, is_sign_up, navigate){
  SInfo.setItem('token', token.toString(), {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham',
    encrypt: true
    });

  // AsyncStorage.setItem('@Token:key', token.toString());
  if (is_sign_up === 0) {
    navigate('NewProfilePage', {token: token.toString()})
  }else {
    navigate('MyApp', {token: token.toString()})
  }
}


export default class ConfirmationPage extends Component {

 constructor(props){
   super(props);
   this.state={
     confirmation_code : null,
     remaining_time : 150,
     intervalId : undefined,
     can_request_again : false,
     loading : false
   }
   this.request_resend = this.request_resend.bind(this)
   this.login = this.login.bind(this)
 }

 componentWillUnmount(){
   if (this.state.intervalId) {
     clearInterval(this.state.intervalId);
   }
 }

 componentDidMount(){
   intervalId = setInterval(() => {
     if (this.state.remaining_time <= 0) {
       this.setState({can_request_again:true})
     }else {
       this.setState({remaining_time: this.state.remaining_time - 1, can_request_again:false})
     }

   }, 1000);
   this.setState( {intervalId: intervalId});
 }

 login(){
   fetch(login_url
   ,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.props.navigation.state.params.username,
          password: this.props.navigation.state.params.password,
          confirm_code : this.state.confirmation_code
        })
      }
    )
     .then((response) => {
       this.setState({loading:false})
       if (response.status === 200) {
         return response.json()
       }else if (response.status === 400) {
         Alert.alert('خطا', 'کد تایید اشتباه است')
       }
     })
     .then((responseJson) => {
       if (responseJson.hasOwnProperty('token')){
         saveToken(responseJson.token, this.props.navigation.state.params.is_sign_up, this.props.navigation.navigate)
       }
     })
     .catch((error) => {
       console.error(error);
     });
 }

 request_resend(){
   fetch(resend_confirmation_code_url
   ,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.props.navigation.state.params.username,
          password: this.props.navigation.state.params.params.password,
        })
      }
    )
     .then((response) => {
       if (response.status === 200) {
         this.setState({remaining_time : 150, can_request_again:true})
         return
       }else if (response.status == 201) {

       }
       return response.json()
     })
     .then((responseJson) => {

     })
     .catch((error) => {
       console.error(error);
     });
 }

 render(){

   return(
     <View style={{backgroundColor:"#F5F5F5", flex:1, justifyContent:'center'}}>
     <StatusBar
        backgroundColor="#F5F5F5"
        barStyle="dark-content"
      />
      <TextInput
              style={{height: 60, margin: 50, textAlign:'center',borderColor: '#E0E0E0', borderWidth: 1, borderRadius:2}}
              onChangeText={(confirmation_code) => this.setState({confirmation_code})}
              placeholder = 'کد تایید'
              placeholderTextColor = '#757575'
              keyboardType='numeric'
            />
      {this.state.can_request_again ?
      (
        <Text onPress={()=>this.request_resend()} style={{margin:5, textAlign:'center', textDecorationLine:'underline', color:'#1E88E5'}}>
          ارسال مجدد
        </Text>
      )
      :
      (
        <Text style={{textAlign:'center', margin:5}}>
          <Text> ارسال مجدد در </Text>
          <Text>{EnglighNumberToPersian(this.state.remaining_time)}</Text>
          <Text> ثانیه</Text>
        </Text>

      )}
      {this.state.loading?
         (
        <ActivityIndicator/>
      ):(
        <Button
          title='تایید'
          icon = {{name:'done'}}
          raised
          style={{margin:10}}
          onPress={()=>{
            this.setState({loading:true})
            this.login()
          }}
        />
      )}



     </View>
   )
 }
}

// function mapStateToProps(state){
//  return{
//    userData : state.userData
//  };
// }
// function matchDispatchToProps(dispatch){
//  return bindActionCreators({}, dispatch)
// }
// export default connect(mapStateToProps, matchDispatchToProps)(ConfirmationPage);
