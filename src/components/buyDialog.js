import React, { Component } from 'react';
import {StyleSheet, Text,Button ,View, TouchableNativeFeedback, Platform, Modal} from 'react-native';
import { Thumbnail} from 'native-base';
import { Icon, Divider } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';


export default class BuyDialog extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  constructor(props) {
    super(props);
  }

  render(){
    return(
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <View style={{marginTop: 22}}>
          <View>
            <Text>Hello World!</Text>

            <Button title='close' onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}/>

          </View>
        </View>
      </Modal>
    );
  }
}
