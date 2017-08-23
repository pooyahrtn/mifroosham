import React, {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, StatusBar, AsyncStorage, NetInfo, Alert, TextInput} from 'react-native';
import { Container,Content, Header, Body, Text,Footer ,Button, Card, Input, Item, Label, Spinner} from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Icon, ButtonGroup, Avatar, CheckBox, FormLabel, FormInput} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {my_profile, update_profile_photo_url} from '../serverAddress.js';
// import {changeConnectionState} from '../actions/index';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
//


export default class NewProfilePage extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading_profile_pic : false,
      avatar_url : null,
      token : null,
      isConnected : false,
      phone_number_error : false,
      phone_number : null,
      show_phone_number : false,
      bio: null,
      loading: false,
      avatar_url_error : false,
      phone_number_null_error : false,
    }
    // this.props.token = get_user_token()
    this.updateProfileRequest = this.updateProfileRequest.bind(this)
    this.updateProfilePhoto = this.updateProfilePhoto.bind(this)
    this._handleConnectionChange = this._handleConnectionChange.bind(this)
    this.submit = this.submit.bind(this)

  }

  componentDidMount(){
    NetInfo.isConnected.fetch().then(isConnected => {this.setState({isConnected: isConnected})});
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
    AsyncStorage.getItem('@Token:key')
    .then((value) => this.setState({token: value }))
    .catch((error) => {
      console.error(error);
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    this.setState({isConnected:isConnected})
  };

  updatePhoneNumber(phone_number){
    res = /^[0-9]{11}$/.test(phone_number)
    this.setState({phone_number_error: !res})
    if (!res) {
      this.setState({phone_number:phone_number})
    }
  }

  updateProfileRequest(){
    fetch(my_profile
    ,
       {
         method: 'PUT',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           bio: this.state.password,
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

  submit(){
    if (this.state.avatar_url == null) {
      this.setState({avatar_url_error:true})
      return
    }
    if(this.state.phone_number == null || this.state.phone_number ===''){
      this.setState({phone_number_null_error : true})
      return
    }
    this.updatePhoneNumber(this.state.phone_number)
    if(this.state.phone_number_error){
      return
    }
    if (!this.state.isConnected) {
      Alert.alert('اینترنت قطع است', 'لطفا مجددا تلاش کنید.')
      return
    }

  }

  updateProfilePhoto(image){
    if (!this.state.isConnected) {
      Alert.alert('اینترنت قطع است', 'لطفا مجددا تلاش کنید.')
      return
    }
    const file = {
      uri : image.path,             // e.g. 'file:///path/to/file/image123.jpg'
      name : 'profile.jpg',            // e.g. 'image123.jpg',
      type: 'image/jpg'             // e.g. 'image/jpg'
    }
    let formdata = new FormData();
    formdata.append('avatar_url', file)

    fetch(update_profile_photo_url
    ,
       {
         method: 'PUT',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'multipart/form-data',
           'Authorization': 'Token ' + this.state.token,
         },
         body: formdata
       }
     )
      .then((response) => {
        console.log(response);
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('avatar_url')) {
          this.setState({avatar_url: responseJson.avatar_url})
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(){
    return (
      <Container>
        <StatusBar
           backgroundColor="#263238"
           barStyle="light-content"
         />
        <Content style={{backgroundColor: '#263238'}}>
          <View style={{flex:1 , flexDirection:'row', alignItems:'center', justifyContent:'center', padding: 10}}>
            {this.state.avatar_url != null ? (
              <Avatar
                xlarge
                rounded
                source = {{uri:this.state.avatar_url}}
                onPress={() => {
                  ImagePicker.openPicker({
                    width: 300,
                    height: 300,
                    cropperCircleOverlay : true,
                    cropping: true
                  }).then(image => {
                    this.setState({loading_profile_pic: true})
                    console.log('image : ' + image);
                    this.updateProfilePhoto(image)
                  }).catch((error)=>console.log(error));
                }}
                activeOpacity={0.7}
                containerStyle={{}}
                />
            ):(
              <Avatar
                xlarge
                rounded
                icon={{name: 'add-a-photo'}}
                onPress={() => {
                  ImagePicker.openPicker({
                    width: 300,
                    height: 300,
                    includeBase64 : true,
                    cropperCircleOverlay : true,
                    cropping: true
                  }).then(image => {
                    this.setState({loading_profile_pic: true})
                    // console.log('image : ' + image.data);
                    this.updateProfilePhoto(image);
                  }).catch((error)=>console.log(error));
                }}
                activeOpacity={0.7}
                containerStyle={{}}
              />
            )}
          </View>
          {this.state.avatar_url_error &&
            <Text style={styles.errotText}>لطفا برای خود یک عکس انتخاب کنید</Text>
          }
          <Card>
            <View>
              <FormLabel>شماره تماس</FormLabel>
              <FormInput
                keyboardType='numeric'
                onChangeText={(phone_number) => {
                  this.setState({phone_number: phone_number, phone_number_null_error:false})
              }}
                placeholder='لطفا شماره تلفن همراه خود را وارد کنید'
                returnKeyType='next'>
              </FormInput>
              {this.state.phone_number_error &&
                <Text style={styles.errotText}>شماره تماس معتبر نیست</Text>
              }
              {this.state.phone_number_null_error &&
                <Text style={styles.errotText}>شماره تماس برای اعتبارسنجی لازم است.</Text>
              }
              <CheckBox
                right
                title='نشان دادن شماره تماس به دیگران'
                iconRight
                iconType='material'
                checkedIcon='done'
                uncheckedIcon='clear'
                uncheckedColor='red'
                checkedColor='green'
                checked={this.state.show_phone_number}
                onPress={()=>{this.setState({show_phone_number: !this.state.show_phone_number})}}
              />
              <FormLabel>درباره شما</FormLabel>
              <FormInput
                multiline={true}
                numberOfLines = {3}
                onChangeText={(bio) => this.setState({bio})}
                placeholder='درصورت تمایل میتوانید درباره ی خودتان بنویسید.'
                returnKeyType='next'>
              </FormInput>
            </View>
          </Card>
        </Content>
        <Footer style={{backgroundColor: '#263238', alignItems:'center'}}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <Button block success style={{flex:1, margin: 4}} onPress={()=>this.submit()}>
              <Text style={{color:'#ffffff', margin: 2}}>ارسال</Text>
              <Icon color='#ffffff' name='done' />
            </Button>
          )}

        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  textInput:{
    padding:10,
    margin:9
  },
  errotText:{
    color:'red'
  }
})
