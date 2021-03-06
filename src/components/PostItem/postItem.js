import React, { PureComponent } from 'react';
import {StyleSheet,Text, View, Image, TouchableNativeFeedback,TouchableWithoutFeedback, Platform, Dimensions, Alert} from 'react-native';
import { Card, } from 'native-base';
import { Icon, Button, Rating, Avatar } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice, countText} from '../../utility/NumberUtils.js';
import ParsedText from 'react-native-parsed-text';
import {phonecall} from 'react-native-communications'
import {getTimeAgo} from '../../utility/TimerUtil.js';
import {getDistanceInPersian} from '../../utility/DistanceUtil.js'
import {like_post_url, repost_post_url} from '../../serverAddress.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AbstractPostItem from './AbstractPostItem.js';




export default class CardHeaderFooterExample extends AbstractPostItem {

  images=[this.props.post.image_url_0]

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      you_liked : this.props.you_liked,
      you_reposted : this.props.you_reposted,
      n_reposts : this.props.post.n_reposters,
      n_likes : this.props.post.n_likes,
      activeSlide : 0,
    }
    this.theWorstWayToAddImages()
}

  componentDidMount(){
    super.componentDidMount()
  }
  componentWillUnmount(){
    super.componentWillUnmount()
  }

  handlePhonePress(phoneNumber){
    phonecall(phoneNumber, true);
  }

  theWorstWayToAddImages = ()=>{
    if(this.props.post.image_url_1){
      this.images = [...this.images, this.props.post.image_url_1]
    }
    if(this.props.post.image_url_2){
      this.images = [...this.images, this.props.post.image_url_2]
    }
    if(this.props.post.image_url_3){
      this.images = [...this.images, this.props.post.image_url_3]
    }
    if(this.props.post.image_url_4){
      this.images = [...this.images, this.props.post.image_url_4]
    }
    if(this.props.post.image_url_5){
      this.images = [...this.images, this.props.post.image_url_5]
    }
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
        update= {
          you_liked: res.liked,
          n_likes : res.n_likes
        }
        this.setState(update);
        postContainer = this.props
        postContainer.post.n_likes = update.n_likes
        postContainer.you_liked = update.you_liked
        this.props.updatePost(postContainer)
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
              postContainer = this.props;
              postContainer.post.n_reposters = res.n_reposters;
              postContainer.you_reposted = res.you_reposted;
              this.props.updatePost(postContainer);
            })
            .catch(error => {

            });

        }},
      ],
      { cancelable: false }
    )

  }

  _renderImage= ({item, index})=>{
    return <Image style={{width:this.width, height:this.width}} source={{uri:item}}/>
  }

  get pagination () {

    const  activeSlide  = this.state.activeSlide;
    return (
        <Pagination
          dotsLength={this.images.length}
          activeDotIndex={activeSlide}  
          containerStyle={{flex:1, justifyContent:'flex-start', padding:0}}   
          inactiveDotOpacity={0.4}
          dotStyle={{margin:0, padding:0}}
          inactiveDotScale={0.6}
        />
    );
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
      <View style={{ borderRadius: 3,margin:2, marginTop: 5, backgroundColor:'white'}}>
        {this.props.reposter &&

          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end', padding:2 }}>
            <Text style={{fontSize:10,}}>این پست را به اشتراک گذاشت</Text>
            <Icon name='retweet' type='evilicon' color='#444444'/>
            <Text style= {{fontSize:10, margin:1,}}>{this.props.reposter.full_name}</Text>
            <Avatar rounded width={19} height={19} source={{uri: this.props.reposter.avatar_url}}/>
          </View>

        }
        <View style={{flexDirection: 'row', padding: 3,flex:1 , alignItems:'center' }}>
          <Icon name='more-vert' color='#9E9E9E'/>
          <View>
            <Text style= {styles.timeText}> {EnglighNumberToPersian(getTimeAgo(new Date(this.props.post.sent_time).getTime()/1000))}</Text>
            {this.props.post.location && this.props.current_location &&
                <Text style= {styles.timeText}> {getDistanceInPersian(this.props.current_location, this.props.post.location)}</Text>
            }
          </View>

          <TouchableWithoutFeedback onPress={()=> {this.props.openProfilePage(this.props.post.sender.username)}} >
            <View style={{flexDirection:'row', alignItems: 'center', flex:1, justifyContent:'flex-end'}}>
              <View style={{alignItems:'flex-end'}}>
                <Text style= {styles.nameText}>{this.props.post.sender.full_name}</Text>
                <Text style={styles.timeText}>@{this.props.post.sender.username}</Text>
              </View>
              <Avatar rounded small  source={{uri: this.props.post.sender.avatar_url}}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Carousel
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
              data={this.images}
              renderItem={this._renderImage}
              sliderWidth={this.width}
              itemWidth={this.width}
              sliderHeight={this.width}
              itemHeight={this.width}
            />

        <View style={styles.cardItemRow}>
          { this.pagination }
        
          {this.props.post.ads_included &&
            <TouchableWithoutFeedback onPress={()=>this.props.showInvestModal(this.props.post)}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.likeText}>{countText(this.props.post.total_invested_qeroons)}</Text>
                <View style={{padding:1, width:19, height:19, margin:2 ,borderColor:'#000000', borderRadius: 9, borderWidth: 1, alignItems:'center', justifyContent:'flex-end'}}>
                  <Text style={{color:'#000000', fontWeight:'100', fontSize:12}}>ق</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

          }
          {this.props.buyable && (
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.likeText}>{countText(this.state.n_reposts)}</Text>
                <Icon type='evilicon'  name='retweet' color={repost_color} style={styles.imageButtons} size={28} onPress={this.repostPost}/>
              </View>

          )}

          <Text style={styles.likeText}>{countText(this.props.post.n_comments)}</Text>
          <Icon type='evilicon'  name='comment' style={styles.imageButtons} onPress={()=>{this.props.openCommentPage(this.props.post.uuid, this.props.post.title)}} size={28}/>
          <Text style={styles.likeText}>{countText(this.state.n_likes)}</Text>
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
            onPress={()=>{
              if(this.props.buyable){
                this.props.setSelectedItemToBuy(this.props.post, this.props.reposter)
              }
          }}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
            <View style={this.props.buyable?styles.activeBuyButton:styles.deactiveBuyButton}>
              {this.props.post.post_type === 1 ?
                <Text style={styles.priceText}>{EnglishNumberToPersianPrice(this.state.discound_current_price)} تومان</Text>
                :
                <Text style={styles.priceText} >{EnglishNumberToPersianPrice(this.props.post.price)} تومان</Text>
              }
              <Icon type='evilicon'  name='cart' color='#ffffff' size={28}/>
              {this.props.post.post_type === 1 && <Text style={{fontWeight:'100', fontSize:16, color:'white', padding:0, margin:0}}>%</Text>}
            </View>
          </TouchableNativeFeedback>
         }

        </View>
        <View>
        {this.props.post.post_type === 2 &&
          <View style={styles.cardItemRow}>
            <TouchableNativeFeedback
              onPress={()=>{
                if(this.props.buyable && this.state.auction_remaining_time.enabled){
                  this.props.setSelectedItemToBuy(this.props.post, this.props.reposter)
                }
              }}
              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>

              <View style={(this.state.auction_remaining_time.enabled && this.props.buyable)?styles.auctionBuyButton:styles.auctionBuyButtonDisabled}>
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

     </View>
    );
  }
}

// function RenderImage(props){

//   const post = props.post;
//   const width = props.width;
//   postImage = {
//     width,
//     height: width
//   }
//   if(!post.image_url_1){
//     return(
//       <Image source={{uri: post.image_url_0}} style={postImage}/>
//     )
//   }else if (!post.image_url_2) {
//     return(
//       // <Image source={{uri: post.image_url_0}} style={postImage}/>
//       <Swiper height={width}  width={width}   loadMinimal={true}>
//         <Image source={{uri: post.image_url_0}} style={postImage}/>
//         <Image source={{uri: post.image_url_1}} style={postImage}/>
//       </Swiper>
//     )
//   }else if (!post.image_url_3) {
//     return(
//       <Swiper width={width} height={width} loadMinimal={true}>
//         <Image source={{uri: post.image_url_0}} style={postImage}/>
//         <Image source={{uri: post.image_url_1}} style={postImage}/>
//         <Image source={{uri: post.image_url_2}} style={postImage}/>
//       </Swiper>
//     )
//   }else if (!post.image_url_4) {
//     return(
//       <Swiper width={width} height={width} loadMinimal={true}>
//         <Image source={{uri: post.image_url_0}} style={postImage}/>
//         <Image source={{uri: post.image_url_1}} style={postImage}/>
//         <Image source={{uri: post.image_url_2}} style={postImage}/>
//         <Image source={{uri: post.image_url_3}} style={postImage}/>
//       </Swiper>
//     )
//   }else if (!post.image_url_5) {
//     return(
//       <Swiper width={width} height={width} loadMinimal={true}>
//         <Image source={{uri: post.image_url_0}} style={postImage}/>
//         <Image source={{uri: post.image_url_1}} style={postImage}/>
//         <Image source={{uri: post.image_url_2}} style={postImage}/>
//         <Image source={{uri: post.image_url_3}} style={postImage}/>
//         <Image source={{uri: post.image_url_4}} style={postImage}/>
//       </Swiper>
//     )
//   }else {
//     return(
//       <Swiper width={width} height={width} loadMinimal={true}>
//         <Image source={{uri: post.image_url_0}} style={postImage}/>
//         <Image source={{uri: post.image_url_1}} style={postImage}/>
//         <Image source={{uri: post.image_url_2}} style={postImage}/>
//         <Image source={{uri: post.image_url_3}} style={postImage}/>
//         <Image source={{uri: post.image_url_4}} style={postImage}/>
//         <Image source={{uri: post.image_url_5}} style={postImage}/>
//       </Swiper>
//     )
//   }

// }


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
      paddingLeft: 25,
    }
})
