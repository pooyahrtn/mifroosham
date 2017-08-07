import React, { Component } from 'react';
import {StyleSheet,Text, View, Image, TouchableNativeFeedback,TouchableWithoutFeedback, Platform, Dimensions} from 'react-native';
import { Card, Thumbnail} from 'native-base';
import { Icon, Button } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import ParsedText from 'react-native-parsed-text';
import {phonecall} from 'react-native-communications'
import {getRemainingTimeText, getTimeAgo} from '../utility/TimerUtil.js';



function getCurrentPrice(start_time,end_time ,real_price, start_price){
  let now = new Date().getTime()/ 1000;
  if (now >= end_time) {
    return real_price;
  }
  let duration = end_time - start_time;
  return Math.floor(start_price + ((now - start_time)/duration) * (real_price - start_price))
}


export default class CardHeaderFooterExample extends Component {

  constructor(props) {
    super(props);
    if (this.props.type === 2) {
      this.state = {auction_remaining_time: ''}
    }else if (this.props.type === 1) {
      this.state = {discound_current_price: ''};
    }

}

componentDidMount(){
  if (this.props.type === 2) {

    intervalId = setInterval(() => {
      this.setState((prevState, props) => {
      return {auction_remaining_time: getRemainingTimeText(this.props.auction.end_time)};
      });
    }, 1000);
    this.setState( {intervalId: intervalId});
  }
  else if (this.props.type === 1) {
    // this.state = {discound_current_price: getCurrentPrice(this.props.discount.start_time, this.props.discount.end_time,
    //   this.props.discount.real_price, this.props.discount.start_price)};
      intervalId = setInterval(() => {
      this.setState((prevState, props) => {
      return {discound_current_price: getCurrentPrice(this.props.discount.start_time, this.props.discount.end_time,
        this.props.discount.real_price, this.props.discount.start_price)};
      });
    }, 1000);
    this.setState({intervalId: intervalId});
  }
  else {
    this.setState({intervalId : undefined})
  }
}

componentWillUnmount(){
  if (this.state.intervalId) {
    clearInterval(this.state.intervalId);
  }
}


  handlePhonePress(phoneNumber){
    phonecall(phoneNumber, true);
  }


  render() {
    if (this.props.you_liked) {
      heart_color = '#b71c1c'
    }else {
      heart_color = '#000000'
    }
    return (
      <Card>

        <View style={{flexDirection: 'row', padding: 3,flex:1,justifyContent:'flex-end' }}>
          {this.props.is_share &&
            <TouchableWithoutFeedback onPress={()=> {this.props.openProfilePage(this.props.source_posts.sender.id)}} >
              <View style={{flexDirection: 'row', alignItems: 'center' }}>
                <Text style= {styles.nameText}>{this.props.source_post.sender.full_name}</Text>
                <Thumbnail small source={{uri: this.props.source_post.sender.avatar_url}}/>
                <Icon name='retweet'  type='evilicon' color='#444444'/>
              </View>
            </TouchableWithoutFeedback>
          }
          <TouchableWithoutFeedback onPress={()=> {this.props.openProfilePage(this.props.sender.id)}} >
            <View style={{flexDirection:'row', alignItems: 'center'}}>
              <Text style= {styles.nameText}>{this.props.sender.full_name}</Text>
              <Thumbnail small  source={{uri: this.props.sender.avatar_url}}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Image source={{uri: this.props.image_url}}
          style={{width: null , height: Dimensions.get('window').width * this.props.image_height_to_width_ratio,flex : 1, resizeMode:'contain'}}/>
        <View style={styles.cardItemRow}>
          <Text style= {styles.timeText}> {EnglighNumberToPersian(getTimeAgo(this.props.sent_time))}</Text>
          <View style={{flex:1}}>
            <Text style={styles.likesText}>{EnglighNumberToPersian(this.props.likes_count)} نفر پسندیده اند</Text>
          </View>

        </View>

        <View style={styles.cardItemRow}>
        {this.props.is_charity && <View style={{flex:1, justifyContent:'flex-end'}}>
          <Image style={{width:44, height: 20}} source={{uri: 'http://www.mahak-charity.org/main/images/mahak_chareity.png'}}/>
        </View>
        }
        <Text style={styles.titleText} >{this.props.title}</Text>
        </View>


        <ParsedText style={styles.descriptionText}
        parse={
         [
           {type: 'url',                       style: styles.url, onPress: this.handleUrlPress},
           {type: 'phone',                     style: styles.phone, onPress: this.handlePhonePress},
           {pattern: /#([^\s]+)/,              style: styles.hashTag},
         ]
        }
        >
          {this.props.description}
        </ParsedText>

        <View style={styles.cardItemRow}>
          {this.props.type === 2 ?
            <View style={styles.auctionTimerContainer}>
                <Text style={styles.auctionTimerText} >{EnglighNumberToPersian(this.state.auction_remaining_time.text)}</Text>
                <Icon type='evilicon'  name='clock' color='#009688' size={28}/>
            </View>
          :
          <TouchableNativeFeedback
            onPress={()=>{}}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
            <View style={styles.button}>
              {this.props.type === 1 ?
                <Text style={styles.priceText} >{EnglishNumberToPersianPrice(this.state.discound_current_price)} تومان</Text>
                :
                <Text style={styles.priceText} >{EnglishNumberToPersianPrice(this.props.price)} تومان</Text>
              }
              <Icon type='evilicon'  name='cart' color='#ffffff' size={28}/>
            </View>
          </TouchableNativeFeedback>
         }

         <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-end', flex:1 }}>
           <Icon type='evilicon'  name='retweet' style={styles.imageButtons} size={32}/>
           <Icon type='evilicon'  name='comment' style={styles.imageButtons} size={32}/>
           <Icon type='evilicon'  name='heart' color={heart_color} style={styles.imageButtons} size={32}/>
         </View>

        </View>
        <View>
        {this.props.type === 2 &&
          <View style={styles.cardItemRow}>
            <TouchableNativeFeedback
              onPress={()=>{}}
              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>

              <View style={this.state.auction_remaining_time.enabled?styles.auctionBuyButton:styles.auctionBuyButtonDisabled}>
                <Text style={styles.priceText} >بالاترین پیشنهاد {EnglishNumberToPersianPrice(this.props.auction.highest_suggest)} تومان</Text>
                <Icon type='evilicon'  name='arrow-up' color='#ffffff' size={28}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        }
        </View>
     </Card>
    );
  }
}


const styles = StyleSheet.create({
  nameText :{
    paddingRight: 5,
    color: '#444444',
    fontWeight: '100',
    fontSize: 12
  },
  priceText :{
    padding: 3,
    color: '#ffffff',
  },
  likesText: {
    fontWeight: 'bold',
    color: '#444444',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  titleText: {
    fontWeight: 'bold',
    color: '#444444',
    fontSize: 15,
    flex:1,
    paddingRight:5,
  },
  descriptionText: {
    color: '#444444',
    fontSize: 14,
    flex:1,
    padding:3,
    paddingRight:5
  },
  imageButtons:{
    padding: 8,
  },
  cardItemRow:{
    paddingTop:3,
    paddingBottom:3,
    paddingRight:5,
    paddingLeft:5,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
  },
  button: {
   flex:1,
   padding:5,
   flexDirection:'row',
   alignItems: 'center',
   borderRadius: 5,
   justifyContent: 'center',
   backgroundColor: '#43ad47'
   },
   auctionBuyButton: {
    flex:1,
    padding:5,
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#01579B'
    },
    auctionBuyButtonDisabled: {
     flex:1,
     padding:5,
     flexDirection:'row',
     alignItems: 'center',
     borderRadius: 5,
     justifyContent: 'center',
     backgroundColor: '#424242'
     },
   auctionTimerContainer: {
    flex:1,
    padding:5,
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: '#009688'
    },
    auctionTimerText :{
      padding: 3,
      color: '#009688',
    },
    url: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    phone: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    hashTag: {
      color: 'blue',
    },
    timeText:{
      textAlign:'left',
      padding:5,
      color:'#9E9E9E',
      fontWeight: '100',
      fontSize:11,
      flex:1,
    }
})
