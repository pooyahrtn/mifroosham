import React, {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, StatusBar, AsyncStorage} from 'react-native';
import { Container,Content, Header, Body, Text,Footer ,Button, Label, Spinner} from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Icon, ButtonGroup, FormLabel, FormInput, Card} from 'react-native-elements';
import {sign_up_url, resend_confirmation_code_url} from '../serverAddress.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {userData} from '../actions/index';




class Authentication extends Component {

  constructor() {
    super();
    this.state = {
      username: null,
      password: null ,
      confirm_password : null,
      selectedIndex: 0,
      username_error: false,
      phone_number: null,
      phone_number_error: false,
      phone_number_null_error : false,
      password_error : false,
      password_strength_error : false,
      username_exists : false,
      username_should_not_be_null : false,
      password_should_not_be_null : false,
      loading : false,
      incorrect_user_or_password : false
    };
    this.updateIndex = this.updateIndex.bind(this)
    this.updateUsername = this.updateUsername.bind(this)
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this)
    this.checkPasswordMatch = this.checkPasswordMatch.bind(this)
    this.checkPasswordStrengh = this.checkPasswordStrengh.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.login = this.login.bind(this)
    this.signUp = this.signUp.bind(this)
  }




  updateIndex(index){
    this.setState({selectedIndex: index})
  }
  updateUsername(username){
	  res = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/.test(username)
    this.setState({username_error: !res})
    if (res) {
      this.setState({username:username})
      this.setState({username_should_not_be_null: false, username_exists:false})
    }
  }

  checkPasswordMatch(password){
    res = password == this.state.password
    this.setState({password_error: !res, confirm_password: password})
  }

  checkPasswordStrengh(password){
    this.setState({password_should_not_be_null: false, incorrect_user_or_password : false})
    if (password.length < 8) {
      this.setState({password_strength_error: true})
    }else {
      this.setState({password_strength_error: false})
      this.setState({password:password})
    }
  }

  updatePhoneNumber(phone_number){
    res = /^[0-9]{11}$/.test(phone_number)
    this.setState({phone_number_error: !res})
    if (res) {
      this.setState({phone_number:phone_number})
    }
    return res
  }

  validateForm(){
    this.setState({loading: true})
    if (this.state.username === '' || this.state.username == null) {
      this.setState({username_should_not_be_null: true, loading:false})
      return
    }
    if(this.state.password === ''|| this.state.password == null){
      this.setState({password_should_not_be_null: true, loading:false})
      return
    }
    if(this.state.phone_number == null || this.state.phone_number ===''){
      this.setState({phone_number_null_error : true, loading:false})
      return
    }
    if(!this.updatePhoneNumber(this.state.phone_number)){
      this.setState({loading:false})
      return
    }
    this.props.userData({username:this.state.username, password:this.state.password, is_sign_up:this.state.selectedIndex})
    if (this.state.selectedIndex == 0) {
      this.signUp()
    }else {
      this.login()
      // Actions.confirmationPage()
    }

  }

  signUp(){
    fetch(sign_up_url
    ,
       {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           username: this.state.username,
           password: this.state.password,
           phone_number: this.state.phone_number
         })
       }
     )
      .then((response) => {
        if (response.status === 501) {
          this.setState({loading: false, username_exists: true})
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

  login(){
    fetch(resend_confirmation_code_url
    ,
       {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           username: this.state.username,
           password: this.state.password
         })
       }
     )
      .then((response) => {
        this.setState({loading:false})
        if (response.status === 200) {
          Actions.confirmationPage()
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



  render() {
    return (
      <Container>
        <StatusBar
           backgroundColor="#F5F5F5"
           barStyle="dark-content"
         />

        <Text style={{textAlign:'center', backgroundColor:'#F5F5F5',fontSize:30, fontWeight:'bold',
        padding:10, alignItems:'center'}}>سلمینو</Text>
        <Content style={{backgroundColor: '#F5F5F5'}}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={['ثبت نام', 'ورود']}
            selectedBackgroundColor='#006064'
            textStyle={{fontWeight:'bold'}}
            selectedTextStyle={{color:'#ffffff'}}
            containerStyle={{height: 40}} />
            <View style={{flex:1, justifyContent:'flex-end'}}>
              <FormLabel>نام کاربری</FormLabel>
              <FormInput
                editable={true}
                placeholder='نام کاربری'
                onChangeText={(username) => this.updateUsername(username)}
                ref='username'
                returnKeyType='next'

              />

              {this.state.username_error&&
                <Text style={styles.errotText}>نام کاربری باید فقط از حروف لاتین باشد</Text>
                }
              {this.state.username_should_not_be_null &&
              <Text style={styles.errotText}>نام کاربری نمیتواند خالی باشد</Text>}
              {this.state.username_exists &&
                <Text style={styles.errotText}>این نام کاربری قبلا انتخاب شده است.</Text>
              }
              <FormLabel>رمز عبور</FormLabel>
              <FormInput
                  editable={true}
                  secureTextEntry={true}
                  onChangeText={(password) => this.checkPasswordStrengh(password)}
                  ref='password'
                  placeholder='رمز عبور'
                  returnKeyType='next'
                />

              {this.state.selectedIndex == 0 && this.state.password_strength_error &&
                <Text style={styles.errotText}>رمز عبور باید بیشتر از ۸ کاراکتر باشد</Text>
              }
              {this.state.incorrect_user_or_password &&
                <Text style={styles.errotText}>نام کاربری و یا رمز عبور اشتباه است.</Text>
              }
              {this.state.password_should_not_be_null &&
                <Text style={styles.errotText}>رمز عبور نمیتواند خالی باشد</Text>
              }
              {this.state.selectedIndex == 0 &&
              <View>
                <FormLabel>رمز عبور</FormLabel>
                <FormInput
                  editable={true}
                  secureTextEntry={true}
                  onChangeText={(password) => this.checkPasswordMatch(password)}
                  ref='confirm_password'
                  placeholder='تکرار رمز عبور'
                  returnKeyType='next'

                />

              </View>

              }
              {this.state.selectedIndex == 0 && this.state.password_error &&
                <Text style={styles.errotText}>رمز ها با همدیگر تطابق ندارند</Text>
              }
              <FormLabel>شماره تماس</FormLabel>
              <FormInput
                keyboardType='numeric'
                onChangeText={(phone_number) => {
                  this.setState({phone_number: phone_number, phone_number_null_error:false})
              }}
                placeholder='لطفا شماره تلفن همراه خود را وارد کنید'
                returnKeyType='next'/>
              {this.state.phone_number_error &&
                <Text style={styles.errotText}>شماره تماس معتبر نیست</Text>
              }
              {this.state.phone_number_null_error &&
                <Text style={styles.errotText}>شماره تماس برای اعتبارسنجی لازم است.</Text>
              }

          </View>
        </Content>
        <Footer style={{backgroundColor: '#f5f5f5', alignItems:'center'}}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <Button block success style={{flex:1, margin: 4}} onPress={()=>this.validateForm()}>
              <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
              <Icon color='#ffffff' name='done' />
            </Button>
          )}

        </Footer>

      </Container>
    );
  }
}




// {this.state.selectedIndex == 0 &&
//   <Item error={this.state.phone_number_error} style={styles.textInput}>
//     <Input
//       editable={true}
//       placeholder='شماره تلفن همراه'
//       onChangeText={(phone_number) => this.updatePhoneNumber(phone_number)}
//       ref='phone_number'
//       returnKeyType='next'
//     />
//   </Item>
// }
// {this.state.selectedIndex == 0 && this.state.phone_number_error &&
//   <Text style={{color:'red'}}>شماره تماس قابل قبول نمیباشد.</Text>
// }


const styles = StyleSheet.create({
  textInput:{
    padding:2,
    margin:5
  },
  errotText:{
    color:'red',
    padding:1
  }
})


function mapStateToProps(state){
  return{

  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({userData: userData}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Authentication);
