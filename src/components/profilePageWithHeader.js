import React, { Component } from 'react';
import {View} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button ,Content, Header, Body, Title} from 'native-base';
import ProfilePage from './profilePage.js';
import { Actions } from 'react-native-router-flux';

export default class InboxPage extends Component {

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
              <Title style={{ color: '#ffffff', fontWeight:'bold'}}>میفروشم!</Title>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' ,flex:1}}>
          </View>
        </Header>
        <Content>
            <ProfilePage/>
        </Content>

      </Container>
    )
  }
}
