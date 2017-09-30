
import React, {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, StatusBar, NetInfo, Alert, TextInput, BackHandler} from 'react-native';
import { Container,Content, Header, Body, Text,Footer ,Button, Card, Input, Item, Label, Spinner} from 'native-base';
// import {Actions} from 'react-native-router-flux';
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
      isConnected : false,
      show_phone_number : false,
      bio: null,
      loading: false,
      avatar_url_error : false,
      full_name : null,
      full_name_should_not_be_null : false,

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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

  }

  componentWillUnmount() {
   NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  _handleConnectionChange = (isConnected) => {
    this.setState({isConnected:isConnected})
  };

  handleBackButton() {
      BackHandler.exitApp()
      return true;
  }

  updateProfileRequest(){
    fetch(my_profile
    ,
       {
         method: 'PUT',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Authorization': 'Token ' + this.props.navigation.state.params.token,
         },
         body: JSON.stringify({
           bio: this.state.bio,
           show_phone_number: this.state.show_phone_number,
           full_name : this.state.full_name,
           location : null
         })
       }
     )
      .then((response) => {
        this.setState({loading:false})
        if (response.status === 200) {
          this.props.navigation.navigate('MyApp', {token: this.props.navigation.state.params.token})
        }
        return response.json()
      })
      .then((responseJson) => {
        this.setState({loading:false})
        console.log('json : ' + responseJson);
      })
      .catch((error) => {
        this.setState({loading:false})
        console.error(error);
      });
  }

  submit(){
    this.setState({loading:true})
    if (this.state.avatar_url == null) {
      this.setState({avatar_url_error:true, loading:false})
      return
    }

    if(this.state.full_name == null || this.state.full_name === ''){
      this.setState({full_name_should_not_be_null : true, loading:false})
      return
    }

    if (!this.state.isConnected) {
      this.setState({loading:false})
      Alert.alert('اینترنت قطع است', 'لطفا مجددا تلاش کنید.')
      return
    }
    this.updateProfileRequest()

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
           'Authorization': 'Token ' + this.props.navigation.state.params.token,
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
          this.setState({avatar_url: responseJson.avatar_url, avatar_url_error:false})
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
           backgroundColor="#F5F5F5"
           barStyle="dark-content"
         />
        <Content style={{backgroundColor: '#F5F5F5'}}>
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

            <View>
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
              <FormLabel>نام کامل</FormLabel>
              <FormInput
                onChangeText={(full_name) => this.setState({full_name})}
                placeholder='نام کاملی که در برنامه نشان داده میشود.'
                returnKeyType='next'>
              </FormInput>
              {this.state.full_name_should_not_be_null &&
                <Text style={styles.errotText}>انتخاب نام کامل ضروری است</Text>
              }
              <FormLabel>درباره شما</FormLabel>
              <FormInput
                multiline={true}
                numberOfLines = {6}
                onChangeText={(bio) => this.setState({bio})}
                placeholder='درصورت تمایل میتوانید درباره ی خودتان بنویسید.'
                returnKeyType='next'>
              </FormInput>
            </View>
        </Content>
        <Footer style={{backgroundColor: '#F5F5F5', alignItems:'center'}}>
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
