import React, {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, StatusBar, AsyncStorage} from 'react-native';
import { Container,Content, Header, Body, Text,Footer ,Button, Card, Input, Item, Label, Spinner} from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Icon, ButtonGroup} from 'react-native-elements';
import {sign_up_url, login_url} from '../serverAddress.js'

async function saveToken(token, is_sign_up){
  try {
    AsyncStorage.setItem('@Token:key', token.toString());
    if (is_sign_up) {
      Actions.newProfilePage();
    }
  } catch (error) {
    console.log('save_error' + error);
  }
}


class Authentication extends Component {

  constructor() {
    super();
    this.state = {
      username: null,
      password: null ,
      fullname: null,
      confirm_password : null,
      selectedIndex: 0,
      username_error: false,
      phone_number: '12345678912',
      phone_number_error: false,
      password_error : false,
      password_strength_error : false,
      username_exists : false,
      username_should_not_be_null : false,
      password_should_not_be_null : false,
      full_name_should_not_be_null : false,
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
    this.login_or_sign_up = this.login_or_sign_up.bind(this)
  }

  login_or_sign_up(){
    if (this.state.selectedIndex == 0) {
      this.validateForm()
    }else {
      this.login()
    }
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
    if(this.state.fullname == null || this.state.fullname === ''){
      this.setState({full_name_should_not_be_null: true, loading:false})
      return
    }
    if (!this.state.username_error && !this.state.password_error) {
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
             first_name: this.state.fullname
           })
         }
       )
        .then((response) => {
          if (response.status === 201) {
            this.login()
          }
          return response.json()
        })
        .then((responseJson) => {
          console.log(responseJson.username[0]);
          if (responseJson.username[0] === 'A user with that username already exists.' ) {
            this.setState({loading: false, username_exists: true})
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  login(){
    this.setState({loading: true})
    if (this.state.username === '' || this.state.username == null) {
      this.setState({username_should_not_be_null: true, loading:false})
      return
    }
    if(this.state.password === ''|| this.state.password == null){
      this.setState({password_should_not_be_null: true, loading:false})
      return
    }

    fetch(login_url
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
         })
       }
     )
      .then((response) => {
        console.log(response);
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('non_field_errors')) {
          this.setState({incorrect_user_or_password: true})
        }
        if (responseJson.hasOwnProperty('token')) {
          saveToken(responseJson.token, true)
        }
        this.setState({loading: false})
      })
      .catch((error) => {
        console.error(error);
        this.setState({loading : false})
      });
  }



  render() {
    return (
      <Container>
        <StatusBar
           backgroundColor="#263238"
           barStyle="light-content"
         />
        <Content style={{backgroundColor: '#263238'}}>
          <Text style={{flex:1, textAlign:'center', fontSize:30, fontWeight:'bold',
          padding:10, color:'#ffffff', alignItems:'center'}}>سلمینو</Text>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={['ثبت نام', 'ورود']}
            selectedBackgroundColor='#006064'
            textStyle={{fontWeight:'bold'}}
            selectedTextStyle={{color:'#ffffff'}}
            containerStyle={{height: 40}} />
            <Card>
              <Item error={this.state.username_error} style={styles.textInput}>
                <Input
                  editable={true}
                  placeholder='نام کاربری'
                  onChangeText={(username) => this.updateUsername(username)}
                  ref='username'
                  returnKeyType='next'

                />
              </Item>
              {this.state.username_error&&
                <Text style={{color:'red'}}>نام کاربری باید فقط از حروف لاتین باشد</Text>
                }
              {this.state.username_should_not_be_null &&
              <Text style={{color:'red'}}>نام کاربری نمیتواند خالی باشد</Text>}
              {this.state.username_exists &&
                <Text style={{color:'red'}}>این نام کاربری قبلا انتخاب شده است.</Text>
              }

              <Item style={styles.textInput}>
                <Input
                  editable={true}
                  secureTextEntry={true}
                  onChangeText={(password) => this.checkPasswordStrengh(password)}
                  ref='password'
                  placeholder='رمز عبور'
                  returnKeyType='next'

                />
              </Item>
              {this.state.selectedIndex == 0 && this.state.password_strength_error &&
                <Text style={{color:'red'}}>رمز عبور باید بیشتر از ۸ کاراکتر باشد</Text>
              }
              {this.state.incorrect_user_or_password &&
                <Text style={{color:'red'}}>نام کاربری و یا رمز عبور اشتباه است.</Text>
              }
              {this.state.password_should_not_be_null &&
                <Text style={{color:'red'}}>رمز عبور نمیتواند خالی باشد</Text>
              }
              {this.state.selectedIndex == 0 &&
                <Item style={styles.textInput}>
                  <Input
                    editable={true}
                    secureTextEntry={true}
                    onChangeText={(password) => this.checkPasswordMatch(password)}
                    ref='confirm_password'
                    placeholder='تکرار رمز عبور'
                    returnKeyType='next'

                  />
                </Item>
              }
              {this.state.selectedIndex == 0 && this.state.password_error &&
                <Text style={{color:'red'}}>رمز ها با همدیگر تطابق ندارند</Text>
              }
              {this.state.selectedIndex == 0 &&
                <Item error={this.state.username_error} style={styles.textInput}>
                  <Input
                    editable={true}
                    placeholder='نام کامل (نامی که در برنامه نمایش داده میشود)'
                    onChangeText={(fullname) =>{
                      this.setState({fullname})
                      if (fullname !== '') {
                        this.setState({full_name_should_not_be_null: false})
                      }
                  }}
                    ref='fullname'
                    returnKeyType='next'
                  />
                </Item>
              }
              {this.state.full_name_should_not_be_null &&
                <Text style={{color:'red'}}>نام کاربری نمیتواند خالی باشد</Text>
              }
          </Card>

        </Content>
        <Footer style={{backgroundColor: '#263238', alignItems:'center'}}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <Button block success style={{flex:1, margin: 4}} onPress={()=>this.login_or_sign_up()}>
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
  }
})

export default Authentication;
