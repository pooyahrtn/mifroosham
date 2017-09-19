import React, { Component } from 'react';
import {View, FlatList, StyleSheet, TouchableWithoutFeedback, Image, StatusBar, Text, Dimensions, Modal} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button , Header, Body, Title, List, Spinner, Footer, Toast} from 'native-base';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import { Actions } from 'react-native-router-flux';
import {capturedImagePath} from '../actions/index.js';
import Camera from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';

function getPostWidth(){
  let width= Dimensions.get('window').width;
  width -= 3 * 4
  return Math.floor(width / 3)

}

const addImageItem = {addImageItem: true, key : -1}

export default class TakePhotoPage extends Component {

   constructor(params){
     super(params);
     this.state ={loading : false, images : [addImageItem], key:0, select_image_modal:false}
   }

  validateForm = ()=>{
    if(this.state.images.length < 2){
      Toast.show({
              text: 'انتخاب حداقل یک عکس الزامی است',
              position: 'bottom',
              duration : 3000,
              type: 'danger'
            })
      return;
    }else {
      this.props.navigation.navigate('NewPostPage', {token : this.props.navigation.state.params.token, data : this.state.images})
    }
  }

  deleteImage = (key) =>{
    var data = this.state.images
    data = data.filter(item => item.key !== key)
    foundAddItem = false;
    for (var i = 0; i < data.length; i++) {
      if(data[i].addImageItem){
        foundAddItem = true;
        break;
      }
    }
    if(!foundAddItem){
      data = [...data, addImageItem]
    }
    this.setState({images: data})
  }

  render(){
    return(
      <Container>
        <Modal
          transparent={true}
          visible={this.state.select_image_modal}
          onRequestClose={() => {this.setState({select_image_modal: !this.state.select_image_modal})}}
          animationType="fade"
          >
          <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.20)'}}>
            <View style={{backgroundColor:'#ffffff', padding: 10, margin: 20, borderRadius: 8}}>
              <TouchableWithoutFeedback  onPress= {()=>{
                  ImagePicker.openCamera({
                    width: 600,
                    height: 600,
                    cropping: true,
                    multiple : false
                  }).then(image => {
                    data = this.state.images
                    data.pop()
                    if(data.length < 5){
                      data = [...data,{uri:image.path, key: this.state.key, addImageItem:false}, addImageItem]
                      this.setState({images : data, key : this.state.key + 1, select_image_modal:false})
                    }
                    else {
                      data = [...data,{uri:image.path, key: this.state.key, addImageItem:false}]
                      this.setState({images : data, key : this.state.key + 1, select_image_modal:false})
                    }

                  });
                }}>
                <View style={{ flexDirection:'row', margin: 15, justifyContent:'center'}}>
                  <Text style={{flex:1, margin: 5}}>گرفتن عکس</Text>
                  <Icon name='add-a-photo' />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback  onPress= {()=>{
                  ImagePicker.openPicker({
                    width: 600,
                    height: 600,
                    cropping: true,
                    multiple : false
                  }).then(image => {
                    data = this.state.images
                    data.pop()
                    if(data.length < 5){
                      data = [...data,{uri:image.path, key: this.state.key, addImageItem:false}, addImageItem]
                      this.setState({images : data, key : this.state.key + 1, select_image_modal:false})
                    }
                    else {
                      data = [...data,{uri:image.path, key: this.state.key, addImageItem:false}]
                      this.setState({images : data, key : this.state.key + 1, select_image_modal:false})
                    }
                  });
                }}>
                <View style={{ flexDirection:'row', margin: 15, justifyContent:'center'}}>
                  <Text style={{flex:1, margin:5}}>انتخاب از گالری</Text>
                  <Icon name='photo' />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
        <Header style={{backgroundColor: '#F5F5F5'}}>
          <StatusBar
             backgroundColor="#F5F5F5"
             barStyle="dark-content"
           />
           <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:1}}>
               <Title style={{color:'#000000', fontWeight:'bold'}}>پست جدید</Title>
           </View>
        </Header>
        <View style={{flex:1 , backgroundColor:"#F5F5F5", paddingTop : 10}}>
          <FlatList
            style={{flex:1}}
            data = {this.state.images}
            numColumns = {3}
            contentContainerStyle={{justifyContent:'center'}}

            renderItem = {({item})=>
                <View style={{width:getPostWidth() , height:getPostWidth() , borderRadius:2 , margin: 2, backgroundColor:'#ffffff'}}>
                  {item.addImageItem ?
                    (
                      <TouchableWithoutFeedback onPress={()=>this.setState({select_image_modal: true})}>
                        <View style={{width:getPostWidth() , height:getPostWidth() , borderRadius:2 , borderColor:'green', borderWidth:2, alignItems:'center', justifyContent:'center'}}>
                          <Icon name='plus' color='#0d0d0d' type='evilicon' size={35}/>
                          <Text>اضافه کردن عکس</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )
                    :
                    (
                      <View>
                        <Image style={{width:getPostWidth() -2, height:getPostWidth() -2, margin: 1, borderRadius:2 }} source={{uri: item.uri}}/>
                        <View style={{height: 30, width: 30, borderRadius:15 ,position: 'absolute', top: 10, left: 10, backgroundColor:'rgba(0,0,0,0.60)', justifyContent:'center', alignItems:'center'}}>
                          <Icon reverse name='delete' style={{}} onPress={()=>{this.deleteImage(item.key)}}/>
                        </View>
                      </View>
                    )
                  }
                </View>

            }
          />


        </View>
        <Footer style={{backgroundColor: '#f5f5f5', alignItems:'center'}}>

          <Button block success style={{flex:1, margin: 4}} onPress={()=>this.validateForm()}>
            <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
            <Icon color='#ffffff' name='done' />
          </Button>

        </Footer>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  cameraPreview:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').width,
  },
  cameraBackCircle:{
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems:'center',
    justifyContent:'center',
    margin: 10,
    backgroundColor:'#EEEEEE'
  }
})
