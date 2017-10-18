import React, { PureComponent } from 'react';
import {StyleSheet,Text, View, Image,TouchableWithoutFeedback, Dimensions} from 'react-native';
import { Card, } from 'native-base';
import { Icon, Avatar } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../../utility/NumberUtils.js';
import {getTimeAgo} from '../../utility/TimerUtil.js';
import {getDistanceInPersian} from '../../utility/DistanceUtil.js'
import Swiper from 'react-native-swiper';
import AbstractPostItem from './AbstractPostItem.js';




export default class CardHeaderFooterExample extends AbstractPostItem {

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    }
  }

  componentDidMount(){
    super.componentDidMount()
  }
  componentWillUnmount(){
    super.componentWillUnmount()
  }

  iconSize = 18;


  render() {
    return (
      <TouchableWithoutFeedback onPress={()=>this.props.openPostDetail({post:this.props.post,you_liked:this.props.post.you_liked, you_reposted: this.props.post.you_reposted, is_repost: false})}>
        <View style={{ borderRadius: 3, marginTop: 5, backgroundColor:'white' , margin: 2}}>

          <View style={{flexDirection: 'row', padding: 3,flex:1 , alignItems:'center' }}>

            <View>
              <Text style= {styles.timeText}> {EnglighNumberToPersian(getTimeAgo(new Date(this.props.post.sent_time).getTime()/1000))}</Text>
              {this.props.post.location && this.props.current_location &&
                  <Text style= {styles.timeText}> {getDistanceInPersian(this.props.current_location, this.props.post.location)}</Text>
              }
            </View>


            <View style={{flexDirection:'row', alignItems: 'center', flex:1, justifyContent:'flex-end'}}>

              <Avatar rounded small  source={{uri: this.props.post.sender.avatar_url}}/>
            </View>

          </View>
          <RenderImage post={this.props.post} width={this.width}/>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
            {this.props.post.ads_included &&

              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.likeText}>{EnglighNumberToPersian(this.props.post.total_invested_qeroons)}</Text>
                <View style={{padding:1, width:12, height:12, margin:2 ,borderColor:'#000000', borderRadius: 6, borderWidth: 1, alignItems:'center', justifyContent:'flex-end'}}>
                  <Text style={{color:'#000000', fontWeight:'100', fontSize:9}}>ق</Text>
                </View>
              </View>

            }


            <Text style={styles.likeText}>{EnglighNumberToPersian(this.props.post.n_reposters)}</Text>
            <Icon type='evilicon' size={this.iconSize}  name='retweet' style={styles.imageButtons}/>

            <Text style={styles.likeText}>{EnglighNumberToPersian(this.props.post.n_comments)}</Text>
            <Icon type='evilicon' size={this.iconSize}  name='comment' style={styles.imageButtons} />
            <Text style={styles.likeText}>{EnglighNumberToPersian(this.props.post.n_likes)}</Text>
            <Icon type='evilicon' size={this.iconSize} name='heart' style={styles.imageButtons} />

          </View>

          <View style={styles.cardItemRow}>
          {this.props.post.is_charity && <View style={{flex:1, justifyContent:'flex-end'}}>
            <Image style={{width:44, height: 20}} source={{uri: 'http://www.mahak-charity.org/main/images/mahak_chareity.png'}}/>
          </View>
          }
          <Text style={styles.titleText} >{this.props.post.title}</Text>
          </View>




          <View style={styles.cardItemRow}>
            {this.props.post.post_type === 2 ?
              <View style={styles.auctionTimerContainer}>
                  <Text style={styles.auctionTimerText} >{EnglighNumberToPersian(this.state.auction_remaining_time.text)}</Text>
        
                  <Icon type='evilicon'  name='clock' color='#009688' size={28}/>
              </View>
            :

              <View style={this.props.buyable?styles.activeBuyButton:styles.deactiveBuyButton}>
                {this.props.post.post_type === 1 ?
                  <Text style={styles.priceText}>{EnglishNumberToPersianPrice(this.state.discound_current_price)} تومان</Text>
                  :
                  <Text style={styles.priceText} >{EnglishNumberToPersianPrice(this.props.post.price)} تومان</Text>
                }
                <Icon type='evilicon'  name='cart' color='#ffffff' size={28}/>
                {this.props.post.post_type === 1 && <Text style={{fontWeight:'100', fontSize:16, color:'white', padding:0, margin:0}}>%</Text>}
              </View>

           }

          </View>
          <View>
          {this.props.post.post_type === 2 &&
            <View style={styles.cardItemRow}>


              <View style={(this.state.auction_remaining_time.enabled && this.props.buyable)?styles.auctionBuyButton:styles.auctionBuyButtonDisabled}>
                <Text style={styles.priceText} >{this.props.post.auction.highest_suggest ?
                   EnglishNumberToPersianPrice(this.props.post.auction.highest_suggest)
                    :
                    EnglishNumberToPersianPrice(this.props.post.auction.base_money)
                   } تومان</Text>
                <Icon type='evilicon'  name='arrow-up' color='#ffffff' size={28}/>
              </View>

            </View>
          }
          </View>

       </View>
      </TouchableWithoutFeedback>
    );
  }
}

function RenderImage(props){

  const post = props.post;
  const width = props.width;
  postImage = {
    width,
    height: width
  }
  
  return(
      <Image source={{uri: post.image_url_0}} style={postImage}/>
  )


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
     backgroundColor: '#9E9E9E'
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
      padding:2,
      marginRight:3,
      color:'gray',
      fontWeight: '100',
      fontSize:12,
    },
    likeText:{
      fontSize: 11,
      paddingLeft: 20,
    }
})
