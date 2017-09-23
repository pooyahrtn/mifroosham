import React, { Component } from 'react';
import {View, Text, StatusBar, Image, StyleSheet, TouchableWithoutFeedback, Alert, Modal, TextInput, ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button , Header, Title,Spinner, Footer, Toast, Card, Content} from 'native-base';
import {getRemainingTimeText} from '../utility/TimerUtil.js';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {buy_post_helps_url, buy_item_url, my_profile ,posts_url, auction_suggest_higher_url} from '../serverAddress.js';
import { NavigationActions } from 'react-navigation';

function getCurrentPrice(start_date,end_date ,real_price, start_price){
  let start_time = new Date(start_date).getTime()/1000
  let end_time = new Date(end_date).getTime() / 1000
  let now = new Date().getTime()/ 1000;
  if (now >= end_time) {
    return real_price;
  }
  let duration = end_time - start_time;
  return Math.floor(start_price + ((now - start_time)/duration) * (real_price - start_price))
}


export default class BuyItemPage extends Component {
  post = this.props.navigation.state.params.post
  reposter = this.props.navigation.state.params.reposter
  token = this.props.navigation.state.params.token

  constructor(props){
    super(props)
    this.state = {
      buy_post_helps: undefined,
      agree : false,
      show_success_modal: false,
      confirm_code : 0,
      remaining_money : undefined,
      load_profile_error : false,
      show_higher_suggest : false,
      auction_higher_suggest : undefined,
      auction_error_text: ' ',

      loading_auction_higher_suggest : false,
    }
    if (this.post.post_type === 2) {
      this.state = {...this.state, auction_remaining_time: 0,  auction_highest_suggest : this.post.auction.highest_suggest,}
    }else if (this.post.post_type === 1) {
      this.state = {...this.state, discound_current_price: 0};
    }
  }

  componentDidMount(){
    if (this.post.post_type === 2) {

      intervalId = setInterval(() => {
        this.setState((prevState, props) => {
        return {auction_remaining_time: getRemainingTimeText(this.post.auction.end_time)};
        });
      }, 1000);
      this.setState( {intervalId: intervalId});
    }
    else if (this.post.post_type === 1) {

        intervalId = setInterval(() => {
        this.setState((prevState, props) => {
        return {discound_current_price: getCurrentPrice(this.post.discount.start_time, this.post.discount.end_time,
          this.post.discount.real_price, this.post.discount.start_price)};
        });
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    else {
      this.setState({intervalId : undefined})
    }
    fetch(buy_post_helps_url).then((response) => {
      return response.json()
    }).then((resjson) =>{this.setState({buy_post_helps: resjson})}).catch((error) => console.error(error, 'shit this fuck'))
    this.getMyProfileData()
  }

    componentWillUnmount(){
      if (this.state.intervalId) {
        clearInterval(this.state.intervalId);
      }
    }
    buyItem = ()=>{
      if(!this.state.agree){
        Toast.show({
                text: 'لطفا شرایط را بخوانید',
                position: 'bottom',
                duration : 3000,
                type: 'danger'
              })
        return;
      }
      if(this.post.post_type === 2){
        this.setState({show_higher_suggest : true})
        return
      }
      console.log(this.token);
      console.log(this.post.uuid);
      fetch(buy_item_url,  {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Authorization': 'Token ' + this.token
         },
         body: JSON.stringify({
           post_uuid : this.post.uuid,
           reposter_username : this.reposter
         })
       }).then( res => {
         if(res.status === 406){
           Alert.alert('خطا', 'موجودی حساب شما کافی نیست.')
           return
         }
         if(res.status === 201){
           this.setState({show_success_modal: true})
           return res.json()
         }
         if(res.status === 403){
           Toast.show({
                   text: 'این پست دیگر موجود نیست.',
                   position: 'bottom',
                   duration : 3000,
                 })
           const resetAction = NavigationActions.reset({
             index: 0,
             actions: [
               NavigationActions.navigate({ routeName: 'MyApp'})
             ]
           })
           this.props.navigation.dispatch(resetAction)
         }
       }).then(
         (resjes) =>{
           this.setState({confirm_code: resjes.confirm_code})
         }
       ).catch(error => {
         Toast.show({
                 text: 'خطایی بوجود آمد',
                 position: 'bottom',
                 duration : 3000,
                 type: 'danger'
               })
       })


    }
  getMyProfileData = ()=>{
    fetch(my_profile,{
       method: 'GET',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': 'Token ' + this.token
       }
     })
     .then((res) => res.json()).then(
      (resjes) => {this.setState({remaining_money: resjes.money, load_profile_error:false})}
    ).catch(
      (error) =>{
        //TODO: send error to server
        this.setState({load_profile_error : true})
      }
    )
  }

  myMoneyButtonPressed = ()=>{
    if(this.state.load_profile_error){
      this.getMyProfileData()
    }else{

    }
  }

  auctionSuggestHigher = ()=>{
    if(!this.state.auction_higher_suggest){
      this.setState({auction_error_text:'پیشنهاد نمیتواند خالی باشد.'})
    }else{
      min_value = 0
      if(this.post.auction_higher_suggest){
        min_value = this.state.auction_highest_suggest
      }else{
        min_value = this.post.auction.base_money
      }
      if(this.state.auction_higher_suggest < min_value){
        this.setState({auction_error_text:'پیشنهاد داده شده از بالاترین پیشنهاد کمتر است.'})
      }else{
        fetch(auction_suggest_higher_url,  {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Authorization': 'Token ' + this.token
           },
           body: JSON.stringify({
             post_uuid : this.post.uuid,
             reposter_username : this.reposter,
             higher_suggest : this.state.auction_higher_suggest
           })
         }).then( res => {
           if(res.status === 406){
             Alert.alert('خطا', 'موجودی حساب شما کافی نیست.')
             return
           }
           if(res.status === 201){
             this.setState({show_success_modal: true})
             return res.json()
           }
           if(res.status === 403){
             Toast.show({
                     text: 'این پست دیگر موجود نیست.',
                     position: 'bottom',
                     duration : 3000,
                   })
             const resetAction = NavigationActions.reset({
               index: 0,
               actions: [
                 NavigationActions.navigate({ routeName: 'MyApp'})
               ]
             })
             this.props.navigation.dispatch(resetAction)
           }else if(res.status === 413){
             this.setState({auction_suggest_higher:'پیشنهاد شما کمتر از بالاترین پیشنهاد است.'})
           }
         }).then(
           (resjes) =>{
             this.setState({confirm_code: resjes.confirm_code, show_success_modal:true})
           }
         ).catch(error => {
           Toast.show({
                   text: 'خطایی بوجود آمد',
                   position: 'bottom',
                   duration : 3000,
                   type: 'danger'
                 })
         })

      }
    }
  }

  refreshHighestSuggest = ()=>{
    this.setState({loading_auction_higher_suggest: true})
    fetch(posts_url+this.post.uuid,  {
       method: 'GET',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': 'Token ' + this.token
       }
     }).then( res => {
       this.setState({loading_auction_higher_suggest: false})
       return res.json();
     }).then(
       (resjes) =>{
         this.setState({auction_highest_suggest: resjes.auction.highest_suggest})
       }
     ).catch(error => {
       Toast.show({
               text: 'خطایی بوجود آمد',
               position: 'bottom',
               duration : 3000,
               type: 'danger'
             })
     })
  }

  render(){
    return(
      <Container>
        <Modal
          transparent={true}
          visible={this.state.show_success_modal}
          onRequestClose={() => {this.setState({show_success_modal: !this.state.show_success_modal})}}
          animationType="fade"
          >
          <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
            <View style={{padding: 2, margin: 10, backgroundColor:'white', borderRadius: 5}}>
              {this.post.post_type === 2 ?
                (
                  <Text style={{fontWeight:'bold', textAlign:'center', color:'green'}}>پیشنهاد بالاتر درج شد</Text>
                )
                :
                (
                  <Text style={{fontWeight:'bold', textAlign:'center', color:'green'}}>آگهی مورد نظر خریده شد.</Text>
                )}

              <Text style={{fontWeight:'bold', textAlign:'center', color:'green', margin: 5}}>
                <Text style={{textDecorationLine:'underline'}}>
                  <Text>کد تحویل: </Text>
                  <Text>{this.state.confirm_code}</Text>
                </Text>
              </Text>
              {this.state.buy_post_helps && <Text style={{margin:5}}>{this.state.buy_post_helps.confirm_code}</Text>}
              <TouchableWithoutFeedback onPress={()=>{
                this.setState({show_success_modal:false, show_higher_suggest :false})
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MyApp'})
                  ]
                })
                this.props.navigation.dispatch(resetAction)
              }} style={{margin: 4}}>
                <View style={{backgroundColor:'green',margin: 3, alignItems:'center', justifyContent:'center', borderRadius: 2, height: 40}}>
                  <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
        {this.post.post_type === 2 &&
          <Modal
            transparent={true}
            visible={this.state.show_higher_suggest}
            onRequestClose={() => {this.setState({show_higher_suggest: !this.state.show_higher_suggest})}}
            animationType="fade"
            >
            <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
              <View style={{padding: 2, margin: 10, backgroundColor:'white', borderRadius: 5}}>

                <View style={{padding: 10,  alignItems:'center', justifyContent:'center', margin: 3, flexDirection:'row'}}>
                  <Text style={styles.priceText} >بالاترین پیشنهاد {this.state.auction_highest_suggest ?
                     EnglishNumberToPersianPrice(this.state.auction_highest_suggest)
                      :
                      EnglishNumberToPersianPrice(this.post.auction.base_money)
                     } تومان</Text>
                  {this.state.loading_auction_higher_suggest ?
                    (<ActivityIndicator/>) : (  <Icon name='refresh' color='green' onPress={this.refreshHighestSuggest}/>)}

                </View>
                <View style={{flexDirection:'row', alignItems:'center',height: 40, borderColor: 'green', borderWidth: 1, borderRadius:2, margin:3}}>
                  <Text style={{margin:5}}>تومان</Text>
                  <TextInput
                    style={{flex:1, textAlign:'center'}}
                    onChangeText={(text) => this.setState({auction_higher_suggest: text, auction_error_text: ' '})}
                    autoFocus
                    keyboardType='numeric'
                    placeholder='پیشنهاد شما'
                    placeholderTextColor = 'gray'
                  />
                </View>
                <Text style={{padding: 5, fontWeight:'bold', color:'red'}}>{this.state.auction_error_text}</Text>

                <TouchableWithoutFeedback onPress={this.auctionSuggestHigher} style={{margin: 4}}>
                  <View style={{backgroundColor:'green',margin: 3, alignItems:'center', justifyContent:'center', borderRadius: 2, height: 40}}>
                    <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>
        }

        <Header style={{backgroundColor: '#F5F5F5'}}>
          <StatusBar
             backgroundColor="#F5F5F5"
             barStyle="dark-content"
           />
           <View style={{justifyContent:'center', alignItems:'center'}}>
              <Icon name='arrow-back' style={{padding: 5}} onPress={()=>{this.props.navigation.goBack()}}/>
           </View>
           <View style= {{padding: 5,alignItems:'flex-start' ,justifyContent: 'center'}}>
               <Text style={{color:'#000000', fontWeight:'bold', fontSize: 16}}>خرید</Text>
           </View>
           <Button success onPress={this.myMoneyButtonPressed} style={{flex:1}}>
              {this.state.load_profile_error && (
                <Icon name='refresh' color='white'/>
              )}
              {this.state.remaining_money > -1 &&
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <Text style={{color:'white', fontWeight:'bold'}}>
                    <Text>موجودی </Text>
                    <Text>{EnglishNumberToPersianPrice(this.state.remaining_money)}</Text>
                    <Text> تومان</Text>
                  </Text>
                  <Icon color='white' name='add'/>
                </View>
              }

           </Button>
        </Header>
        <Content>
          <Card>
            <View style={{flexDirection:'row', alignItems:'stretch', padding:5}}>
              <View style={{flex:1,  paddingRight: 5}}>
                  <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{fontWeight:'bold', color:'green',  textAlign:'center'}}>{this.post.title}</Text>
                  </View>

                  <View style={{borderWidth:1, margin:4, borderColor:'green', borderRadius: 2, justifyContent:'center', alignItems:'center', flex:1}}>
                    {this.post.post_type === 2 ?
                    (
                      <Text style={styles.priceText} >بالاترین پیشنهاد {this.state.auction_highest_suggest ?
                         EnglishNumberToPersianPrice(this.state.auction_highest_suggest)
                          :
                          EnglishNumberToPersianPrice(this.post.auction.base_money)
                         } تومان</Text>
                    ) :
                     (
                     this.post.post_type === 1 ?
                       <Text style={styles.priceText}>{EnglishNumberToPersianPrice(this.state.discound_current_price)} تومان</Text>
                       :
                       <Text style={styles.priceText} >{EnglishNumberToPersianPrice(this.post.price)} تومان</Text>

                    )}

                  </View>

              </View>
            <Card style={{flex:0}}>
              <Image style={{height: 90, width: 90, borderRadius:1}} source={{uri:this.post.image_url_0}}/>
            </Card>

            </View>
            <View style={{flexDirection:'row', padding: 5, alignItems:'center'}}>
              <View style={{flex:1}}>
                <Text>
                  <Text style={{fontWeight:'bold',}}>مهلت تحویل: </Text>
                  <Text>{EnglighNumberToPersian(this.post.deliver_time)}</Text>
                  <Text> روز.</Text>
                </Text>
                {this.state.buy_post_helps && <Text>{this.state.buy_post_helps.deliver_time}</Text>}
              </View>

              <Icon name='access-time' style={{margin: 4}}/>
            </View>
            {this.post.post_type === 2 && this.state.buy_post_helps &&


              <View style={styles.warningContainer}>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'bold',}}>مزایده</Text>
                  <Text >{this.state.buy_post_helps.auction}</Text>
                </View>

                <Icon style={{margin:4}} name='arrow-upward'/>
              </View>


            }
            {this.post.is_charity &&
              <View style={{flexDirection:'row', padding: 5, alignItems:'center'}}>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'bold',}}>به نفع خیریه</Text>
                  {this.state.buy_post_helps && <Text>{this.state.buy_post_helps.charity}</Text>}
                </View>
                <Icon name='face' style={{margin: 4}}/>
              </View>
            }
            {this.post.ads_included && this.post.total_invested_qeroons > 0 &&
              <View style={{flexDirection:'row', padding: 5, alignItems:'center'}}>
                <View style={{flex:1}}>
                  <Text >
                    <Text style={{fontWeight:'bold',}}>قرون هایی که بدست می آورید: </Text>
                    <Text>{EnglighNumberToPersian(this.post.total_invested_qeroons)}</Text>
                    <Text> قرون. </Text>
                  </Text>
                  {this.state.buy_post_helps && <Text>{this.state.buy_post_helps.qeroons}</Text>}
                </View>

                <View style={{margin:3, alignItems:'center'}}>
                  <View style={{padding:1, width:20, height:20, margin:2 ,borderColor:'#000000', borderRadius: 10, borderWidth: 2, alignItems:'center', justifyContent:'flex-end'}}>
                    <Text style={{color:'#000000', fontWeight:'100', fontSize:12}}>ق</Text>
                  </View>
                </View>
              </View>
            }
            {this.state.buy_post_helps &&
              <View style={{flexDirection:'row', padding:5}}>
                <Text style={{flex:1}}>{this.state.buy_post_helps.phone_number}</Text>
                <Icon name='phone' style={{margin: 4}}/>
              </View>
            }
            {this.state.buy_post_helps && this.post.post_type === 1&&

              <View style={styles.warningContainer}>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'bold'}}>تخفیف زمان</Text>
                  <Text >{this.state.buy_post_helps.discount}</Text>
                </View>
                <Text style={{fontWeight:'bold', fontSize:23, color:'black', margin:4}}>%</Text>
              </View>
            }

            {this.state.buy_post_helps &&
              <TouchableWithoutFeedback onPress={()=>{this.setState({agree: !this.state.agree})}}>
                <View style={{flexDirection:'row', padding:5, alignItems:'center'}}>
                  <Text style={{flex:1, textDecorationLine:'underline'}}>شرایط را خواندم و با آنها موافقم</Text>
                    {this.state.agree?(
                      <Icon color='#33691E' name='check-box' size={25} />
                    ):(
                      <Icon name='check-box-outline-blank'size={25}/>
                    )}
                </View>
              </TouchableWithoutFeedback>
            }

          </Card>

        </Content>
        <Footer style={{backgroundColor: 'transparent'}}>
          <Button block success={this.state.agree} disabled={!this.state.agree} onPress={this.buyItem} style={{flex:1, margin: 4}}>
            {this.post.post_type !== 2 ?
              (
                <Text style={{color:'#ffffff', margin: 2}}>تکمیل خرید</Text>
              )
              :
              (
                <Text style={{color:'#ffffff', margin: 2}}>پیشنهاد بالاتر</Text>
              )}

            <Icon color='#ffffff' name='done' />

          </Button>
        </Footer>
      </Container>
    )
  }

}


const styles = StyleSheet.create({
  priceText :{
    fontWeight:'bold', color:'green'
  },
  warningContainer:{
    flexDirection:'row',
    padding:5}
  })
