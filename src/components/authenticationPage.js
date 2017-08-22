import React, {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, StatusBar} from 'react-native';
import { Container,Content, Header, Body, Text,Footer ,Button, Card, Input, Item, Label} from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Icon, ButtonGroup} from 'react-native-elements';
import {sign_up_url} from '../serverAddress.js'

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
      full_name_should_not_be_null : false
    };
    this.updateIndex = this.updateIndex.bind(this)
    this.updateUsername = this.updateUsername.bind(this)
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this)
    this.checkPasswordMatch = this.checkPasswordMatch.bind(this)
    this.checkPasswordStrengh = this.checkPasswordStrengh.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  userSignup() {
    Actions.frame();
  }

  userLogin() {
    Actions.frame();
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
  updatePhoneNumber(phone_number){
    res = /^[0-9]{11}$/.test(phone_number)
    this.setState({phone_number_error: !res})
    if (!res) {
      this.setState({phone_number:phone_number})
    }
  }
  checkPasswordMatch(password){
    res = password == this.state.password
    this.setState({password_error: !res, confirm_password: password})
  }

  checkPasswordStrengh(password){
    if (password.length < 8) {
      this.setState({password_strength_error: true})
    }else {
      this.setState({password_strength_error: false})
      this.setState({password:password, password_should_not_be_null: false})
    }
  }

  validateForm(){

    if (this.state.username === '' || this.state.username == null) {
      this.setState({username_should_not_be_null: true})
      return
    }
    if(this.state.password === ''|| this.state.password == null){
      this.setState({password_should_not_be_null: true})
      return
    }
    if(this.state.fullname == null || this.state.fullname === ''){
      this.setState({full_name_should_not_be_null: true})
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
         .then((response) =>{
           console.log(response.json());

         }
         )
         .then((responseJson) => {

         })
         .catch((error) => {
           console.error(error);
         });
    }

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
                <Text style={{color:'red'}}>این نام کاربری قبلا انتحاب شده است</Text>
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
        <Footer style={{backgroundColor: '#263238'}}>
          <Button block success style={{flex:1, margin: 4}} onPress={()=>this.validateForm()}>
            <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
            <Icon color='#ffffff' name='done' />

          </Button>
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
