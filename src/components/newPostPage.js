import React, { Component } from 'react';
import {View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableWithoutFeedback, TextInput} from 'react-native';
import { Icon, ButtonGroup} from 'react-native-elements';
import { Container,Button ,Content, Header,Footer, Title, Card,Item, Input, Label} from 'native-base';
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
      end_price: 0,
      end_time : 24,
      chariety : false,
      description: '',
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
          <TextInput style={{flex:1, margin: 5}} multiline={true} numberOfLines = {4}
            maxLength={350} onChangeText={(text) => this.setState({description: text})}
            placeholder='توضیحات... از # برای دسته بندی استفاده کنید. مثلا #کتاب'
          />
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
            <PriceMode mode={this.state.selectedIndex} setState={this.setState}/>
            {(this.state.selectedIndex === 0 || this.state.selectedIndex === 1)&& (<View style={{padding:9, flexDirection:'row', alignItems:'center'}}>
              <TouchableWithoutFeedback onPress={()=>{this.setState({end_time: this.state.end_time - 1})}}>
                <View>
                  <Icon style={{margin:8}} name='keyboard-arrow-down' />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{this.setState({end_time: this.state.end_time + 1})}}>
                <View>
                  <Icon style={{margin:8}} name='keyboard-arrow-up' />
                </View>
              </TouchableWithoutFeedback>
              <Text style={{flex:1}}>
                <Text>زمان اتمام </Text>
                <Text>{EnglighNumberToPersian(this.state.end_time)}</Text>
                <Text> ساعت دیگر.</Text>
              </Text>
              <Icon type='evilicon'  name='clock'/>
            </View>
            )}
        </Card>
        <Card>
          <TouchableWithoutFeedback onPress={()=>{this.setState({chariety: !this.state.chariety})}}>
            <View style={{flexDirection:'row', padding:9, alignItems:'center'}}>
              <Image style={{width:44, height: 20}} source={{uri: 'http://www.mahak-charity.org/main/images/mahak_chareity.png'}}/>
              <Text style={{flex:1}}>
                <Text>به نفع خیریه محک</Text>
                {this.state.chariety?(<Text> باشد</Text>):(<Text> نباشد</Text>)}
              </Text>
              {this.state.chariety?(
                <Icon type='evilicon' color='#FF9800' name='check' size={30} />
              ):(
                <Icon type='evilicon'  name='close-o'size={30}/>
              )}
            </View>
          </TouchableWithoutFeedback>
        </Card>

        </Content>
        <Footer style={{backgroundColor: 'transparent'}}>
          <Button block success style={{flex:1, margin: 4}}>
            <Text style={{color:'#ffffff', margin: 2}}>ارسال</Text>
            <Icon color='#ffffff' name='send' />

          </Button>
        </Footer>

      </Container>
    )
  }
}


function PriceMode(params){
  let mode = params.mode;
  let setState = params.setState;
  if (mode === 2) {
    return(
      <View style={styles.priceContainer}>
        <Text style={{margin:5}}>تومان</Text>
        <Item floatingLabel style={{ flex:1}}>
          <Label>قیمت</Label>
          <Input keyboardType='numeric' onChangeText={(text) => setState({price: text})}/>
        </Item>
        <Icon style={{margin:5}} name='credit-card'/>
      </View>
    )
  }else if(mode === 1){
    return(
      <View>
        <View style={styles.priceContainer}>
          <Text style={{margin:5}}>تومان</Text>
          <Item floatingLabel style={{ flex:1}}>
            <Label>قیمت شروع</Label>
            <Input keyboardType='numeric' onChangeText={(text) => setState({price: text})}/>
          </Item>
          <Icon style={{margin:5}} name='credit-card'/>
        </View>
        <View style={styles.priceContainer}>
          <Text style={{margin:5}}>تومان</Text>
          <Item floatingLabel style={{ flex:1}}>
            <Label>قیمت پایان</Label>
            <Input keyboardType='numeric' onChangeText={(text) => setState({end_price: text})}/>
          </Item>
          <Icon style={{margin:5}} name='credit-card'/>
        </View>
      </View>
    )
  }else {
    return(
       <View style={styles.priceContainer}>
        <Text style={{margin:5}}>تومان</Text>
        <Item floatingLabel style={{ flex:1}}>
          <Label>قیمت پایه</Label>
          <Input keyboardType='numeric' onChangeText={(text) => setState({price: text})}/>
        </Item>
        <Icon style={{margin:5}} name='credit-card'/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  priceContainer:{
    padding:3,
    flexDirection:'row',
    alignItems:'flex-end'
  },
  postButton:{
    flex:1
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
