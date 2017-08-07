import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button ,Content, Header, Body, Title, List} from 'native-base';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';
import {capturedImagePath} from '../actions/index.js';


 class NewPostPage extends Component {

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
        <Content>
        <View style={{flexDirection:'row'}}>
          <Image source={{uri:this.props.capturedImagePath}} style={{width: 100, height:100}}/>
        </View>

        </Content>

      </Container>
    )
  }
}


const styles = StyleSheet.create({
  cameraPreview:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').width,
  }
})


function mapStateToProps(state){
  return{
    capturedImagePath: state.capturedImagePath
  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(NewPostPage);
