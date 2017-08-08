import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableWithoutFeedback} from 'react-native';
import { Icon, ButtonGroup} from 'react-native-elements';
import { Container,Button ,Content, Header, Body, Title, Card,Item, Input, Label} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';
import {capturedImagePath} from '../actions/index.js';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';


class NewPostPage extends Component {

  constructor(params){
    super(params);
    this.state={
      titleText : '',
      selectedIndex: 2,
      priceText : 'قیمت',
      price: 0,
      auction_end_time : 24,
    }
    // WHY?!?!
    this.updateIndex = this.updateIndex.bind(this)
  }
  updateIndex (index) {
    let text = ''
    if (index === 1) {
      text = 'قیمت'
    }else {
      text = 'قیمت پایه'
    }
    this.setState({selectedIndex: index, priceText : text})
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
        <Content>
        <Card>
          <View style={{flexDirection:'row', alignItems:'flex-end', padding:3}}>
            <View style={{flex:1}}>
            <Item floatingLabel>
              <Label>عنوان محصول</Label>
              <Input/>
            </Item>
            </View>
            <Image source={{uri:this.props.capturedImagePath}} style={{width: 100, height:100, borderRadius: 1}}/>
          </View>
        </Card>
        <Card>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={['مزایده','حراج', 'نقد']}
            selectedBackgroundColor='#006064'
            textStyle={{fontWeight:'bold'}}
            selectedTextStyle={{color:'#ffffff'}}
            containerStyle={{height: 40}} />
            <View style={{padding:3, flexDirection:'row', alignItems:'flex-end'}}>
              <Text style={{margin:5}}>تومان</Text>
              <Item floatingLabel style={{ flex:1}}>
                <Label>{this.state.priceText}</Label>
                <Input keyboardType='numeric' onChangeText={(text) => this.setState({price: text})}/>
              </Item>
              <Icon style={{margin:5}} name='credit-card'/>
            </View>
            {this.state.selectedIndex === 0 && (<View style={{padding:9, flexDirection:'row', alignItems:'center'}}>
              <TouchableWithoutFeedback onPress={()=>{this.setState({auction_end_time: this.state.auction_end_time - 1})}}>
                <View>
                  <Icon style={{margin:8}} name='keyboard-arrow-down' />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{this.setState({auction_end_time: this.state.auction_end_time + 1})}}>
                <View>
                  <Icon style={{margin:8}} name='keyboard-arrow-up' />
                </View>
              </TouchableWithoutFeedback>
              <Text style={{flex:1}}>
                <Text>زمان اتمام </Text>
                <Text>{EnglighNumberToPersian(this.state.auction_end_time)}</Text>
                <Text> ساعت دیگر.</Text>
              </Text>
              <Icon type='evilicon'  name='clock'/>
            </View>
            )}
        </Card>

        </Content>

      </Container>
    )
  }
}


const styles = StyleSheet.create({

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
