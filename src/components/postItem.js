import React, { PureComponent } from 'react';
import {StyleSheet,Text, View, Image, TouchableNativeFeedback,TouchableWithoutFeedback, Platform, Dimensions, Alert} from 'react-native';
import { Card, } from 'native-base';
import { Icon, Button, Rating, Avatar } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import ParsedText from 'react-native-parsed-text';
import {phonecall} from 'react-native-communications'
import {getRemainingTimeText, getTimeAgo} from '../utility/TimerUtil.js';
import {like_post_url, repost_post_url} from '../serverAddress.js';



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


export default class CardHeaderFooterExample extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      you_liked : this.props.you_liked,
      you_reposted : this.props.you_reposted,
      n_reposts : this.props.post.n_reposters,
      n_likes : this.props.post.n_likes
    }
    if (this.props.post.post_type === 2) {
      this.state = {...this.state, auction_remaining_time: 0}
    }else if (this.props.post.post_type === 1) {
      this.state = {...this.state, discound_current_price: 0};
    }

}

componentDidMount(){
  if (this.props.post.post_type === 2) {

    intervalId = setInterval(() => {
      this.setState((prevState, props) => {
      return {auction_remaining_time: getRemainingTimeText(this.props.post.auction.end_time)};
      });
    }, 1000);
    this.setState( {intervalId: intervalId});
  }
  else if (this.props.post.post_type === 1) {

      intervalId = setInterval(() => {
      this.setState((prevState, props) => {
      return {discound_current_price: getCurrentPrice(this.props.post.discount.start_time, this.props.post.discount.end_time,
        this.props.post.discount.real_price, this.props.post.discount.start_price)};
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

  likePost = () => {
    this.setState({
      you_liked : !this.state.you_liked
    })
    fetch(like_post_url+this.props.post.uuid,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.props.token
        }
      }
    )
      .then(res => {
        if(res.status === 200)
        return res.json()
      })
      .then(res => {
        this.setState({
          you_liked: res.liked,
          n_likes : res.n_likes
        });
      })
      .catch(error => {

      });
  }

  repostPost = () => {
    bodyText = 'در صورتی که پست به اشتراک گذاشته شده، خریداری شود، ۵ درصد از مبلغ آن به شما میرسد. آیا تمایل به اشتراک گذاشتن پست دارید؟'
    Alert.alert(
      'به اشتراک گذاشتن',
      bodyText,
      [
        {text: 'خیر', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'بله', onPress: () => {
          this.setState({
            you_reposted : !this.state.you_reposted
          })
          fetch(repost_post_url+this.props.post.uuid,
            {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.props.token
              }
            }
          )
            .then(res => {
              if(res.status === 200)
              return res.json()
            })
            .then(res => {
              this.setState({
                you_reposted: res.reposted,
                n_reposts : res.n_reposters
              });
            })
            .catch(error => {

            });

        }},
      ],
      { cancelable: false }
    )

  }

  render() {
    if (this.state.you_liked) {
      heart_color = '#b71c1c'
    }else {
      heart_color = '#000000'
    }
    if (this.state.you_reposted) {
      repost_color = '#b71c1c'
    }else {
      repost_color = '#000000'
    }
    return (
      <Card>
        {this.props.reposter &&
          <TouchableWithoutFeedback onPress={()=> {this.props.openProfilePage(this.props.reposter.profile.username)}} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end', padding:1 }}>
              <Icon name='retweet'  type='evilicon' color='#444444'/>
              <Avatar rounded width={20} height={20} source={{uri: this.props.reposter.profile.avatar_url}}/>
            </View>
          </TouchableWithoutFeedback>
        }
        <View style={{flexDirection: 'row', padding: 3,flex:1 , alignItems:'center' }}>
          <Text style= {styles.timeText}> {EnglighNumberToPersian(getTimeAgo(new Date(this.props.post.sent_time).getTime()/1000))}</Text>
          {this.props.reposter &&
            <Rating
            imageSize={12}
            readonly
            startingValue={this.props.post.sender.profile.score}
            style = {{margin: 3}}
            />}
          <TouchableWithoutFeedback onPress={()=> {this.props.openProfilePage(this.props.post.sender.username)}} >
            <View style={{flexDirection:'row', alignItems: 'center'}}>
              <Text style= {styles.nameText}>{this.props.post.sender.profile.full_name}</Text>
              <Avatar rounded small  source={{uri: this.props.post.sender.profile.avatar_url}}/>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Image source={{uri: this.props.post.image_url}}
          style={{width: null , height: Dimensions.get('window').width, }}/>


        <View style={styles.cardItemRow}>
          <Text style={styles.likeText}>{EnglighNumberToPersian(this.props.post.total_invested_qeroons)}</Text>
          <Icon type='evilicon'  name='star' color={heart_color} style={styles.imageButtons} size={28} onPress={this.likePost}/>
          <Text style={styles.likeText}>{EnglighNumberToPersian(this.state.n_reposts)}</Text>
          <Icon type='evilicon'  name='retweet' color={repost_color} style={styles.imageButtons} size={28} onPress={this.repostPost}/>
          <Text style={styles.likeText}>{EnglighNumberToPersian(this.state.n_likes)}</Text>
          <Icon type='evilicon'  name='comment' style={styles.imageButtons} size={28}/>
          <Text style={styles.likeText}>{EnglighNumberToPersian(this.state.n_likes)}</Text>
          <Icon type='evilicon'  name='heart' color={heart_color} style={styles.imageButtons} size={28} onPress={this.likePost}/>

        </View>

        <View style={styles.cardItemRow}>
        {this.props.post.is_charity && <View style={{flex:1, justifyContent:'flex-end'}}>
          <Image style={{width:44, height: 20}} source={{uri: 'http://www.mahak-charity.org/main/images/mahak_chareity.png'}}/>
        </View>
        }
        <Text style={styles.titleText} >{this.props.post.title}</Text>
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
          {this.props.post.description}
        </ParsedText>

        <View style={styles.cardItemRow}>
          {this.props.post.post_type === 2 ?
            <View style={styles.auctionTimerContainer}>
                <Text style={styles.auctionTimerText} >{EnglighNumberToPersian(this.state.auction_remaining_time.text)}</Text>
                <Text style={{ fontSize:11}} > زمان باقی مانده </Text>
                <Icon type='evilicon'  name='clock' color='#009688' size={28}/>
            </View>
          :
          <TouchableNativeFeedback
            onPress={()=>{}}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
            <View style={this.props.buyable?styles.activeBuyButton:styles.deactiveBuyButton}>
              {this.props.post.post_type === 1 ?
                <Text style={styles.priceText}>{EnglishNumberToPersianPrice(this.state.discound_current_price)} تومان</Text>
                :
                <Text style={styles.priceText} >{EnglishNumberToPersianPrice(this.props.post.price)} تومان</Text>
              }
              <Icon type='evilicon'  name='cart' color='#ffffff' size={28}/>
            </View>
          </TouchableNativeFeedback>
         }

        </View>
        <View>
        {this.props.post.post_type === 2 &&
          <View style={styles.cardItemRow}>
            <TouchableNativeFeedback
              onPress={()=>{}}
              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>

              <View style={this.state.auction_remaining_time.enabled?styles.auctionBuyButton:styles.auctionBuyButtonDisabled}>
                <Text style={styles.priceText} >بالاترین پیشنهاد {this.props.post.auction.highest_suggest ?
                   EnglishNumberToPersianPrice(this.props.post.auction.highest_suggest)
                    :
                    EnglishNumberToPersianPrice(this.props.post.auction.base_money)
                   } تومان</Text>
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
    padding: 1,
    color: '#ffffff',
  },
  likesText: {
    fontWeight: 'bold',
    color: '#444444',
    textDecorationLine: 'underline',
    marginRight: 2,
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
    padding: 1,
  },
  cardItemRow:{
    paddingTop:2,
    paddingBottom:2,
    paddingRight:3,
    paddingLeft:3,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  activeBuyButton: {
    flex:1,
   padding:4,
   flexDirection:'row',
   alignItems: 'center',
   borderRadius: 5,
   justifyContent: 'center',
   backgroundColor: '#43ad47'
   },
   deactiveBuyButton: {
     flex:1,
    padding:4,
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#9E9E9E'
    },
   auctionBuyButton: {
    flex:1,
    padding:4,
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#01579B'
    },
    auctionBuyButtonDisabled: {
     flex:1,
     padding:4,
     flexDirection:'row',
     alignItems: 'center',
     borderRadius: 5,
     justifyContent: 'center',
     backgroundColor: '#424242'
     },
   auctionTimerContainer: {
    flex:1,
    padding:3,
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: '#009688'
    },
    auctionTimerText :{
      padding: 1,
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
    },
    likeText:{
      fontSize: 11,
      paddingLeft: 30,
    }
})
