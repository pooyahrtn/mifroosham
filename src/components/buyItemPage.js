import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { Icon } from 'react-native-elements';


export default class BuyItemPage extends Component {

  render(){
    return(
      <View style={{backgroundColor:'transparent'}}>
        <Text>{this.props.navigation.state.params.post.title}</Text>
      </View>
    )
  }

}
