import React, { Component } from 'react';
import {View, Alert, StyleSheet, Image, Dimensions, Text, TouchableWithoutFeedback, TextInput} from 'react-native';
import { Icon, ButtonGroup} from 'react-native-elements';
import { Container,Button ,Content, Header,Footer, Title, Card,Item, Input, Label} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {capturedImagePath} from '../actions/index.js';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {send_post_url} from '../serverAddress.js';


export default class NewPostPage extends Component {

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
      deliverTime : 48,
      fixed_price_cant_be_null : false,
      min_price_error : false,
      max_price_cant_be_null : false,
      start_price_greater_than_end : false,
    }

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

  validateForm = ()=>{
    if(this.state.price === 0){
      this.setState({fixed_price_cant_be_null: true});
      return false;
    }
    //discount max value check
    if(this.state.selectedIndex === 1 && this.state.end_price === 0){
      this.setState({max_price_cant_be_null: true});
      return false;
    }
    if(this.state.price < 1000){
      this.setState({min_price_error: true});
      return false;
    }
    // discount type error
    if(this.state.selectedIndex === 1 && this.state.end_price < this.state.price){
      this.setState({start_price_greater_than_end: true});
      return false;
    }
    if (this.state.titleText == null || this.state.titleText === '') {
      Alert.alert('خطا', 'عنوان محصول نمیتواند خالی باشد.');
      return false;
    }
    return true;
  }

  sendPost = () => {
    if(!this.validateForm()){
      return
    }
    const file = {
      uri : this.props.navigation.state.params.data,             // e.g. 'file:///path/to/file/image123.jpg'
      name : 'profile.jpg',            // e.g. 'image123.jpg',
      type: 'image/jpg'             // e.g. 'image/jpg'
    }

    let formdata = new FormData();
    formdata.append('image_url', file);
    formdata.append('title', this.state.titleText);
    formdata.append('sender_type', 2- this.state.selectedIndex);
    formdata.append('description', this.state.description);
    formdata.append('is_charity', this.state.chariety)
    formdata.append('deliver_time', this.state.deliverTime)
    if(this.state.selectedIndex === 2){
      formdata.append('price', this.state.price);

    }else{
      formdata.append('price', 0)
    }


    fetch(send_post_url
    ,
       {
         method: 'POST',
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

      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(){
    return(
      <Container>
        <Header androidStatusBarColor="#263238" style={{backgroundColor: '#37474F'}}>
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' ,flex:1}}>

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
              <Input onChangeText={(text) => {this.setState({titleText : text})}}/>
            </Item>
            </View>
            <Image source={{uri:this.props.navigation.state.params.data}} style={{width: 100, height:100, borderRadius: 1}}/>
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
            buttons={['مزایده','حراج', 'مقطوع']}
            selectedBackgroundColor='#006064'
            textStyle={{fontWeight:'bold'}}
            selectedTextStyle={{color:'#ffffff'}}
            containerStyle={{height: 40}} />
            <PriceMode mode={this.state.selectedIndex} setState={(data)=>this.setState(data)}/>
            {this.state.min_price_error && <Text style={styles.errorText}>حداقل قیمت باید ۱۰۰۰ تومان باشد.</Text>}
            {this.state.fixed_price_cant_be_null && <Text style={styles.errorText}>قیمت نمیتواند خالی باشد</Text>}
            {this.state.max_price_cant_be_null && <Text style={styles.errorText}>قیمت پایان نمیتواند خالی باشد.</Text>}
            {this.state.start_price_greater_than_end && <Text style={styles.errorText}>قیمت شروع نمیتواند بیشتر از قیمت پایان باشد.</Text>}
            {(this.state.selectedIndex === 0 || this.state.selectedIndex === 1)&& (
              <View style={{padding:9, flexDirection:'row', alignItems:'center'}}>
                <Icon type='simple-line-icon' name='minus' style={styles.changeTimePlusText} onPress={()=>{this.setState({end_time: this.state.end_time - 1})}}/>
                <Icon type='simple-line-icon' name='plus' style={styles.changeTimePlusText} onPress={()=>{this.setState({end_time: this.state.end_time + 1})}} />
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
              <Text style={{flex:1, margin: 3}}>
                <Text>به نفع خیریه محک</Text>
                {this.state.chariety?(<Text> باشد</Text>):(<Text> نباشد</Text>)}
              </Text>
              {this.state.chariety?(
                <Icon color='#33691E' name='check-box' size={25} />
              ):(
                <Icon name='check-box-outline-blank'size={25}/>
              )}
            </View>
          </TouchableWithoutFeedback>
        </Card>
        <Card>
          <View style={{padding:9, flexDirection:'row', alignItems:'center'}}>

            <Icon type='simple-line-icon' name='minus' style={styles.changeTimePlusText} onPress={()=>{this.setState({deliverTime: this.state.deliverTime - 1})}}/>

            <Icon type='simple-line-icon' name='plus' style={styles.changeTimePlusText} onPress={()=>{this.setState({deliverTime: this.state.deliverTime + 1})}}/>

            <Text style={{flex:1}}>
              <Text>زمان تحویل </Text>
              <Text>{EnglighNumberToPersian(this.state.deliverTime)}</Text>
              <Text> ساعت دیگر.</Text>
            </Text>
            <Icon type='evilicon'  name='clock'/>
          </View>
        </Card>

        </Content>
        <Footer style={{backgroundColor: 'transparent'}}>
          <Button block success onPress={this.sendPost} style={{flex:1, margin: 4}}>
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
  },
  changeTimePlusText:{
    margin : 5,
    marginRight:25
  },
  errorText:{
    color:'red',
    margin: 3
  }
})
