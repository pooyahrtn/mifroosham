import React, { Component } from 'react';
import {View, FlatList, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button , Header, Body, Title, List, Spinner} from 'native-base';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';
import {capturedImagePath} from '../actions/index.js';
import Camera from 'react-native-camera';

 class TakePhotoPage extends Component {

   constructor(params){
     super(params);
     this.state ={loading : false}
   }
 takePicture() {
    this.camera.capture()
      .then((data) => {
        this.props.capturedImagePath(data.path);
        Actions.newPostPage();
        this.setState({loading: false});
      })
      .catch(err => console.error(err));
  }
  render(){
    return(
      <Container>
        <Header androidStatusBarColor="#263238" style={{backgroundColor: '#37474F'}}>
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' ,flex:1}}>
            <Button transparent onPress= {()=>Actions.pop()}>
              <Icon name='arrow-back' color='#ffffff'/>
            </Button>
          </View>

          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:2}}>
              <Title style={{ color: '#ffffff', fontWeight:'bold'}}>پست جدید</Title>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' ,flex:1}}>
          </View>
        </Header>
        <View style={{flex:1}}>
          <Camera
             ref={(cam) => {
               this.camera = cam;
             }}
             captureQuality="medium"
             playSoundOnCapture={false}
             style={styles.cameraPreview}
             aspect={Camera.constants.Aspect.fill}>
         </Camera>
         <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
          {this.state.loading?(
            <Spinner color='red' />
          ):
            (<TouchableWithoutFeedback onPress= {()=>{
              this.setState({loading:true});
             this.takePicture();
            }}>
             <View style={styles.cameraBackCircle}>
                <Icon name='add-a-photo' color='#000000' size={40}/>
             </View>

             </TouchableWithoutFeedback>)}

         </View>
        </View>

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
    backgroundColor:'#E0E0E0'
  }
})


function mapStateToProps(state){
  return{

  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({capturedImagePath: capturedImagePath }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(TakePhotoPage);
