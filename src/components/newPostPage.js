import React, { Component } from 'react';
import {View, Alert, StyleSheet, Image, Dimensions, Text, TouchableWithoutFeedback, TextInput, Modal, ScrollView, ActivityIndicator, ToastAndroid} from 'react-native';
import { Icon, ButtonGroup} from 'react-native-elements';
import { Container,Button ,Content, Header,Footer, Title, Card, Label} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {capturedImagePath} from '../actions/index.js';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {send_post_url, send_post_helps_url} from '../serverAddress.js';
import { NavigationActions } from 'react-navigation';


export default class NewPostPage extends Component {

  constructor(params){
    super(params);
    this.state={
      titleText : '',
      selectedIndex: 2,
      priceText : 'قیمت',
      price: 0,
      end_price: 0,
      end_time : 1,
      chariety : false,
      description: '',
      deliverTime : 2,
      fixed_price_cant_be_null : false,
      min_price_error : false,
      max_price_cant_be_null : false,
      start_price_greater_than_end : false,
      ads_included : false,
      show_help_modal : false,
      helps_texts : undefined,
      postLocation : undefined,
      loading_location: false,
      selected_help : '',
      show_send_modal: false,
      send_loading : false,
      sending_failed : false,
      disable_after_buy : true,
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  componentDidMount (){
      this.requestLoadHelpInvestmetnText()
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

  requestLoadHelpInvestmetnText = ()=>{
    fetch(send_post_helps_url).then((response) => {
      return response.json()
    }).then((resjson) =>{this.setState({helps_texts: resjson})}).catch((error) => console.error(error, 'shit this fuck'))
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
  showSendModal = () =>{
    if(!this.validateForm()){
      return
    }
    this.setState({show_send_modal : true})
  }
  sendPost = () => {
    if(!this.validateForm()){
      return
    }
    if(this.state.send_loading){
      return
    }else{
      this.setState({send_loading: true})
    }
    var formdata = new FormData();

    for (var i = 0; i < this.props.navigation.state.params.data.length - 1; i++) {
      var file = {
        uri : this.props.navigation.state.params.data[i].uri,             // e.g. 'file:///path/to/file/image123.jpg'
        name : 'profile.jpg',            // e.g. 'image123.jpg',
        type: 'image/jpg'             // e.g. 'image/jpg'
      }
      formdata.append('image_url_'+i, file)
    }

    formdata.append('image_url', file);
    formdata.append('title', this.state.titleText);
    formdata.append('sender_type', 2- this.state.selectedIndex);
    formdata.append('description', this.state.description);
    formdata.append('is_charity', this.state.chariety)
    formdata.append('deliver_time', this.state.deliverTime)
    if(this.state.postLocation){
        formdata.append('location', this.state.postLocation)
    }

    formdata.append('next_buy_ben', 0);
    if(this.state.selectedIndex === 2){
      formdata.append('price', this.state.price);
      formdata.append('disable_after_buy', this.state.disable_after_buy)
    }else{
      formdata.append('price', 0)
    }
    if(this.state.selectedIndex === 1){
      formdata.append('discount_start_price', this.state.price)
      formdata.append('discount_end_price', this.state.end_price)
      formdata.append('disable_after_buy', this.state.disable_after_buy)
      formdata.append('end_time', this.state.end_time)
    } else if(this.state.selectedIndex === 0){
      formdata.append('auction_base_price', this.state.price)
      formdata.append('end_time', this.state.end_time)
      formdata.append('disable_after_buy', true)
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
        if(response.status === 201){

          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'MyApp'})
            ]
          })
          this.props.navigation.dispatch(resetAction)
          ToastAndroid.show('پست برای بررسی ارسال شد.', ToastAndroid.LONG);
        }
        return response.json()
      })
      .then((responseJson) => {

      })
      .catch((error) => {
        console.error(error);
      });
  }
  changeEndTime = (increaseValue) =>{
    this.setState(
      (prevState, props) =>{
        if(increaseValue === -1 && prevState.end_time === 1){
          return {end_time: prevState.end_time}
        }else{
          return {end_time : prevState.end_time+ increaseValue}
        }
      }
    )
  }
  changeDeliverTime = (increaseValue) =>{
    this.setState(
      (prevState, props) =>{
        if(increaseValue === -1 && prevState.deliverTime === 1){
          return {deliverTime: prevState.deliverTime}
        }else{
          return {deliverTime : prevState.deliverTime+ increaseValue}
        }
      }
    )
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
        <Modal
          transparent={true}
          visible={this.state.show_help_modal}
          onRequestClose={() => {this.setState({show_help_modal: !this.state.show_help_modal})}}
          animationType="slide"
          >
          <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
            <View style={{margin: 22, backgroundColor:'#ffffff', borderRadius: 3}}>

                <View>
                  {!this.state.helps_texts ? (<Text>تلاش مجدد </Text>):(
                    <Text style={{margin: 10, fontSize:16}}>{this.state.helps_texts[this.state.selected_help]}</Text>
                  )}
                </View>
                <Button block success onPress={()=>this.setState({show_help_modal: !this.state.show_help_modal})} style={{margin: 4}}>
                  <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                </Button>


            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={this.state.show_send_modal}
          onRequestClose={() => {this.setState({show_send_modal: !this.state.show_send_modal})}}
          animationType="slide"
          >
          <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
            <View style={{margin: 22, backgroundColor:'#ffffff', borderRadius: 3, flex:1,}}>
              {!this.state.helps_texts ? (<Text>تلاش مجدد </Text>):(
                <View style={{flex:1}}>
                  <ScrollView style={{margin: 20, flex:1}}>
                    <Text style={{fontSize:16, color:'green', fontWeight:'bold'}}>آیا از صحت اطلاعات وارد شده مطمئنید؟</Text>
                    <View style={{margin: 20}}/>
                    <Text>{this.state.helps_texts.can_change_post}</Text>
                    <Text>{this.state.helps_texts.verify_time}</Text>
                    {this.state.ads_included &&
                      <Text>
                        <Text>• درصورت فروخته شدن، </Text>
                        <Text>{this.state.price * 0.1}</Text>
                        <Text> تومان از قیمت پست کم میشود و به سرمایه گذار ها میرسد. </Text>
                      </Text>}
                    {this.state.chariety && <Text>• در صورت فروش، تمام مبلغ آن به خیریه ای که انتخاب کردید میرسد </Text>}
                  </ScrollView>
                  {this.state.send_loading ?
                  (
                    <View style={{borderColor:'green',margin: 6, alignItems:'center',justifyContent:'center', borderWidth: 1,borderRadius: 2, height: 40}}>
                      <Text style={{color:'green', margin: 2}}>در حال ارسال...</Text>
                    </View>
                  ) :
                  (
                    <View style={{flexDirection:'row'}}>
                        <TouchableWithoutFeedback  onPress={()=>this.setState({show_send_modal: !this.state.show_send_modal})} style={{margin: 4}}>
                          <View style={{borderColor:'red',margin: 6, alignItems:'center', justifyContent: 'center',flex:1, borderRadius: 2, borderWidth:1, height:40}}>
                            <Text style={{color:'red', margin: 2}}>لغو</Text>
                          </View>
                        </TouchableWithoutFeedback>
                        {this.state.sending_failed ?
                          (
                            <TouchableWithoutFeedback onPress={this.sendPost} style={{margin: 4}}>
                              <View style={{backgroundColor:'green',margin: 6, alignItems:'center',justifyContent: 'center',flex:1, borderRadius: 2, height: 40}}>
                                <Text style={{color:'#ffffff', margin: 2}}>تلاش مجدد</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          ) :
                          (
                            <TouchableWithoutFeedback onPress={this.sendPost} style={{margin: 4}}>
                              <View style={{backgroundColor:'green',margin: 6, alignItems:'center', justifyContent:'center',flex:1, borderRadius: 2, height: 40}}>
                                <Text style={{color:'#ffffff', margin: 2}}>ارسال</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          )}

                      </View>
                     )}
                    </View>

              )}
            </View>
          </View>
        </Modal>
        <Card>
          <View style={{flexDirection:'row', alignItems:'flex-end', padding:3}}>
            <View style={{flex:1}}>

            <TextInput returnKeyType='next' placeholderTextColor='gray' placeholder='عنوان' style={{borderRadius:2, borderColor:'#E0E0E0', borderWidth:1, marginRight:3}} onChangeText={(text) => {this.setState({titleText : text})}}/>

            </View>
            <Image source={{uri:this.props.navigation.state.params.data[0].uri}} style={{width: 100, height:100, borderRadius: 1}}/>
          </View>
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
                {this.state.selectedIndex === 0 &&   <Icon name='question' type='evilicon'  style={styles.changeTimePlusText} onPress={()=>{this.setState({show_help_modal:true, selected_help:'auction'})}}/>}
                {this.state.selectedIndex === 1 &&   <Icon name='question' type='evilicon'  style={styles.changeTimePlusText} onPress={()=>{this.setState({show_help_modal:true, selected_help:'discount'})}}/>}
                <Icon type='evilicon' name='minus' style={styles.changeTimePlusText} onPress={()=>this.changeEndTime(-1)}/>
                <Icon type='evilicon' name='plus' style={styles.changeTimePlusText} onPress={()=>this.changeEndTime(1)} />
                <Text style={{flex:1}}>
                  <Text>زمان اتمام </Text>
                  <Text>{EnglighNumberToPersian(this.state.end_time)}</Text>
                  <Text> روز دیگر.</Text>
                </Text>
                <Icon type='evilicon'  name='clock'/>
              </View>
            )}
        </Card>
        {this.state.selectedIndex !== 0 &&
          <Card>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Icon name='question' type='evilicon'  style={{padding:3}} onPress={()=>{this.setState({show_help_modal:true, selected_help:'disable_after_buy'})}}/>
              <TouchableWithoutFeedback onPress={()=>{this.setState({disable_after_buy: !this.state.disable_after_buy})}}>
                <View style={{flexDirection:'row', padding:9, flex:1 ,alignItems:'center'}}>

                  <Text style={{flex:1, margin: 3}}>حذف آگهی پس از فروش</Text>
                  {this.state.disable_after_buy?(
                    <Icon color='#33691E' name='check-box' size={25} />
                  ):(
                    <Icon name='check-box-outline-blank'size={25}/>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Card>
        }

        <Card>
          <Text style={styles.sectionTitleText}>توضیحات</Text>
          <TextInput style={{flex:1, margin: 5}} multiline={true} numberOfLines = {4}
            maxLength={350} onChangeText={(text) => this.setState({description: text})}
            placeholder='توضیحاتی در باره ی محصول بنویسید. از # برای دسته بندی میتوانید استفاده کنید،مثلا #کتاب. شماره تماس و یا نحوه ی تحویل را هم میمی'
          />
        </Card>
        <Card>
          <View style={{padding:9, flexDirection:'row', alignItems:'center'}}>
            <Icon name='question' type='evilicon'  style={styles.changeTimePlusText} onPress={()=>{this.setState({show_help_modal:true, selected_help:'deliver_time'})}}/>
            <Icon type='evilicon' name='minus' style={styles.changeTimePlusText} onPress={()=>this.changeDeliverTime(-1)}/>

            <Icon type='evilicon' name='plus' style={styles.changeTimePlusText} onPress={()=>this.changeDeliverTime(1)}/>

            <Text style={{flex:1}}>
              <Text> مهلت تحویل</Text>
              <Text>{EnglighNumberToPersian(this.state.deliverTime)}</Text>
              <Text> روز. </Text>
            </Text>
            <Icon type='evilicon'  name='clock'/>
          </View>
        </Card>
        <Card>
          <Text style={styles.sectionTitleText}>خیریه</Text>
          <View style={{flexDirection:'row'}}>
            <Icon name='question' type='evilicon'  style={{padding:3}} onPress={()=>{this.setState({show_help_modal:true, selected_help:'charity'})}}/>
            <TouchableWithoutFeedback onPress={()=>{this.setState({chariety: !this.state.chariety})}}>
              <View style={{flexDirection:'row', padding:9, flex:1 ,alignItems:'center'}}>
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
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitleText}>محل فروش (اختیاری)</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Icon name='question' type='evilicon' style={{padding:5}} onPress={()=>{this.setState({show_help_modal:true, selected_help:'location'})}}/>
            <View style={{flex:1 , height: 40}}>
              {this.state.loading_location?
                (
                  <ActivityIndicator style={{margin: 6}}/>
                ) :
                (
                  !this.state.postLocation?
                     (
                       <TouchableWithoutFeedback  onPress={()=>{
                         this.setState({loading_location: true})
                         navigator.geolocation.getCurrentPosition(
                          (position) => {
                           let latitude = Math.round(position.coords.latitude * 100) / 100
                           let longitude = Math.round(position.coords.longitude * 100) / 100
                           postLocation = latitude + ',' + longitude
                           this.setState({postLocation: postLocation, loading_location: false})
                          },
                          (error) => alert(error.message),
                          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
                       );
                       }} >
                       <View style={{borderColor:'green',margin: 6, alignItems:'center',flex:1, borderRadius: 2, borderWidth:1}}>
                        <Text style={{ margin: 2, color:'green'}}>انتخاب منطقه فروشنده</Text>
                       </View>

                       </TouchableWithoutFeedback>
                     ):
                     (
                       <View style={{flexDirection:'row'}}>

                         <TouchableWithoutFeedback  onPress={()=>{
                           this.setState({postLocation: undefined})

                         }} >
                         <View style={{borderColor:'red',margin: 6, alignItems:'center',flex:1, borderRadius: 2, borderWidth:1}}>
                          <Text style={{ margin: 2, color:'red'}}>حذف محل فروش</Text>
                         </View>

                         </TouchableWithoutFeedback>
                         <View style={{borderColor:'green',margin: 6, alignItems:'center',flex:1, borderRadius: 2, borderWidth:1}}>
                          <Text style={{ margin: 2, color:'green'}}>محل فروش انتخاب شد</Text>
                         </View>
                       </View>

                     )

                )}
            </View>

          </View>

        </Card>
        <Card>
          <Text style={styles.sectionTitleText}>تبلیغات</Text>
          <View style={{flexDirection:'row'}}>
            <Icon name='question' type='evilicon'  style={{padding:5}} onPress={()=>{this.setState({show_help_modal:true, selected_help:'investment'})}}/>
            <TouchableWithoutFeedback onPress={()=>{this.setState({ads_included: !this.state.ads_included})}}>
              <View style={{flexDirection:'row', padding:9, flex:1, justifyContent:'center'}}>
                <Text style={{flex:1, margin: 3}}>
                  <Text>۱۰ درصد برای سرمایه گذاری</Text>
                </Text>
                {this.state.ads_included?(
                  <Icon color='#33691E' name='check-box' size={25} />
                ):(
                  <Icon name='check-box-outline-blank'size={25}/>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Card>
        </Content>
        <Footer style={{backgroundColor: 'transparent'}}>
          <Button block success onPress={this.showSendModal} style={{flex:1, margin: 4}}>
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

        <TextInput placeholderTextColor='gray' placeholder='قیمت' keyboardType='numeric' style={styles.priceTextInput} onChangeText={(text) => setState({price: text})}/>

        <Icon style={{margin:5}} name='credit-card'/>
      </View>
    )
  }else if(mode === 1){
    return(
      <View>
        <View style={styles.priceContainer}>
          <Text style={{margin:5}}>تومان</Text>

          <TextInput placeholderTextColor='gray' placeholder='قیمت شروع' keyboardType='numeric' style={styles.priceTextInput}  onChangeText={(text) => setState({price: text})}/>

          <Icon style={{margin:5}} name='credit-card'/>
        </View>
        <View style={styles.priceContainer}>
          <Text style={{margin:5}}>تومان</Text>

          <TextInput placeholderTextColor='gray' placeholder='قیمت پایان' style={styles.priceTextInput}  keyboardType='numeric' onChangeText={(text) => setState({end_price: text})}/>

          <Icon style={{margin:5}} name='credit-card'/>
        </View>
      </View>
    )
  }else {
    return(
       <View style={styles.priceContainer}>
        <Text style={{margin:5}}>تومان</Text>

        <TextInput placeholderTextColor='gray' placeholder='قیمت پایه' style={styles.priceTextInput}  keyboardType='numeric' onChangeText={(text) => setState({price: text})}/>

        <Icon style={{margin:5}} name='credit-card'/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  priceContainer:{
    padding:1,
    margin:5,
    flexDirection:'row',
    alignItems:'flex-end',
    borderColor:'#E0E0E0',
    borderWidth:1,
    borderRadius:2
  },
  priceTextInput:{
    flex:1,
  },
  postButton:{
    flex:1
  },
  changeTimePlusText:{
    padding : 10,
    marginRight:15
  },
  errorText:{
    color:'red',
    margin: 3
  },
  sectionTitleText: {padding:4 , fontSize:11, fontWeight:'bold', color:'green'},
})
