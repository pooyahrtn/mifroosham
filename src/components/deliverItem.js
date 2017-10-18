import React, { PureComponent } from 'react';
import {StyleSheet, View, Image, TouchableNativeFeedback, Platform, Dimensions, Text} from 'react-native';
import { Card ,  Thumbnail} from 'native-base';
import { Icon, Button, Divider } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import ParsedText from 'react-native-parsed-text';
import {phonecall} from 'react-native-communications'
import {getRemainingDays} from '../utility/TimerUtil.js';
import {getTimeAgo} from '../utility/TimerUtil.js';


export default class DeliverItem extends PureComponent{


  componentDidMount(){
    // intervalId = setInterval(() => {
    //  this.setState((prevState, props) => {
    //    return {remaining_time: getRemainingTimeText(this.state.end_time)};
    //  });
    // }, 1000);
    // this.setState({intervalId: intervalId});
  }

  // componentWillUnmount(){
  //   clearInterval(this.state.intervalId);
  // }

  constructor(props){
    super(props);
    var end_time;
    if (this.props.post.post_type === 2) {
      end_time = new Date(this.props.post.auction.end_time)
    }
    else{
      end_time = new Date(this.props.time).getTime() + this.props.post.deliver_time * 60 * 60 * 24 * 1000
    }
    this.state = {
      remaining_time: getRemainingDays(end_time),
    };

  }
  // the title rendering is totally bull shit.
  render(){
    return(
      <Card>
        <View>
        <View style={{flexDirection:'row', justifyContent:'center', padding: 5}}>
          <Text style={{ flex :1}}>{this.props.post.title}</Text>
          <Text style={styles.titleText}>
            {this.props.type === 'SO' && this.props.status === 'pe' && this.props.post.post_type !== 2 &&  (<Text style={{color: '#009688'}}> فروخته شد</Text>)}
            {this.props.type === 'SO' && this.props.status === 'pe' && this.props.post.post_type === 2 &&  (<Text style={{color: '#009688'}}>بالاترین پیشنهاد</Text>)}
            {this.props.type === 'BO' && this.props.status === 'pe' && this.props.post.post_type === 2 &&  (<Text style={{color: '#009688'}}>پینشهاد شما ثبت شد</Text>)}
            {this.props.type === 'BO' && this.props.status === 'pe' && this.props.post.post_type !== 2 && (<Text style={{color: '#009688'}}> خریده شد</Text>)}
            {this.props.status === 'de' && this.props.type === 'SO' &&(<Text style={{color: '#009688'}}> تحویل داده شد</Text>)}
            {this.props.status === 'de' && this.props.type === 'BO' &&(<Text style={{color: '#009688'}}>تحویل گرفته شد </Text>)}
            {this.props.status === 'ca' && this.props.type === 'BO' && !this.props.auction_failed &&(<Text style={{color: '#009688'}}>فروشنده فروش را لغو کرد</Text>)}
            {this.props.status === 'ca' && this.props.type === 'BO' && this.props.auction_failed &&(<Text style={{color: '#009688'}}>پیشنهادی بالاتر از شما ثبت شد</Text>)}
            {this.props.status === 'ca' && this.props.type === 'SO' &&(<Text style={{color: '#009688'}}>فروش لغو شد</Text>)}
           </Text>
        </View>

        <Divider style={{ backgroundColor: '#eeeeee', margin:2 }} />
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{ flexDirection: 'column', alignItems:'stretch', flex:1, justifyContent:'flex-end'}}>
            <View style={{ flexDirection: 'row', justifyContent:'flex-end',padding: 1, alignItems:'center'}}>
              {this.props.status === 'pe' &&
                <Text style= {styles.timeText}>{EnglighNumberToPersian(getTimeAgo(new Date(this.props.time)/1000))}</Text>
              }
              {this.props.status === 'de' &&
                <Text style= {styles.timeText}>{EnglighNumberToPersian(getTimeAgo(new Date(this.props.deliver_time)/1000))}</Text>
              }
              {this.props.status === 'ca' &&
                <Text style= {styles.timeText}>{EnglighNumberToPersian(getTimeAgo(new Date(this.props.cancel_time)/1000))}</Text>
              }


              {this.props.type === 'BO'?
                (<Text style={{padding: 4, flex:1, textAlign:'right'}}>{this.props.post.sender.full_name}</Text>)
              :
                (
                  <Text style={{padding: 4, flex:1, textAlign:'right'}}>{this.props.buyer.full_name}</Text>
                )
              }
              {this.props.type === 'BO'?
                (
                  <Thumbnail small source={{uri: this.props.post.sender.avatar_url}}/>
                )
                :
                (
                  <Thumbnail small source={{uri: this.props.buyer.avatar_url}}/>
                )
              }

            </View>

            {this.props.status === 'pe' && this.props.post.post_type !== 2 &&
              <View style={styles.baseRectangleBorderedStyle}>
                <Text>{EnglighNumberToPersian(this.state.remaining_time.text)}</Text>
                <Text style={{fontSize:12}}> مهلت تحویل : </Text>
                <Icon type='evilicon'  name='clock' color='#009688' size={20}/>
              </View>
            }
            {this.props.status === 'ca' && this.props.auction_failed === true && this.props.type === 'BO' &&
              <View style={styles.baseRectangleBorderedStyle}>
                <Text> تومان</Text>
                <Text>{EnglishNumberToPersianPrice(this.props.post.auction.highest_suggest)}</Text>
                <Text style={{fontSize:12}}>بالاترین پیشنهاد: </Text>

              </View>
            }

            {this.props.status === 'pe' && this.props.post.post_type === 2 &&
              <View style={styles.baseRectangleBorderedStyle}>
                {this.props.post.auction.end_time < new Date() ?
                  (
                    <Text> مهلت تحویل : </Text>
                  )
                  :
                  (
                    <Text > تا اتمام مزایده</Text>
                  )}
                <Text >{EnglighNumberToPersian(this.state.remaining_time.text)}</Text>
                <Icon type='evilicon'  name='clock' color='#009688' size={20}/>
              </View>
            }


            <View style={{flexDirection:'row'}}>


              {(this.props.status === 'de' || this.props.status === 'ca') && (
                <TouchableNativeFeedback
                  onPress={()=>{this.props.deleteItem(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={styles.deleteItemStyle}>
                    <Icon name='delete' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>

              )}
              {this.props.rate_status === 'cr' && this.props.type === 'BO' &&
                <TouchableNativeFeedback
                  onPress={()=>{this.props.showReviewModal(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={styles.blueRectangleStyle}>
                    <Text style={{color:'white'}}>امتیاز دهید</Text>
                    <Icon name='star' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>
              }
              {this.props.rate_status === 'ra' &&
                <TouchableNativeFeedback
                  onPress={()=>{this.props.showReviewModal(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={styles.blueRectangleStyle}>
                    <Text style={{color:'white'}}>امتیاز داده شد</Text>
                    <Icon name='star' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>
              }
              {this.props.rate_status === 'cr' && this.props.type === 'SO' &&
                <View style={styles.baseRectangleBorderedStyle}>
                  <Text style={{}}>امتیازی داده نشده</Text>
                  <Icon name='star' size={26}/>
                </View>
              }
              {this.props.status === 'pe' &&
                <TouchableNativeFeedback
                  onPress={()=>{this.props.makePhoneCall(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={styles.greenRectangleStyle}>
                    <Text style={{color:'white'}}>تماس</Text>
                    <Icon name='phone' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>

              }

              {this.props.status === 'pe' && this.props.type === 'SO' &&
                <TouchableNativeFeedback
                  onPress={()=>{this.props.showCancelSellModal(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={styles.redRectangleStyle}>
                    <Text style={{color:'white'}}>لغو فروش</Text>
                    <Icon name='clear' color='#ffffff' />
                  </View>
                </TouchableNativeFeedback>
              }
              {this.props.type === 'BO' && this.props.status === 'ca' && this.props.auction_failed === true &&
                <TouchableNativeFeedback
                  onPress={()=>{this.props.auctionSuggestHigher(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={styles.greenRectangleStyle}>
                    <Text style={{color:'white'}}>پیشنهاد بالاتر</Text>
                    <Icon name='arrow-upward' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>

              }
              {this.props.type === 'BO' && this.props.status === 'pe' &&
                <View style={styles.baseRectangleBorderedStyle}>
                  <Text>
                    <Text>کد تحویل: </Text>
                    <Text>{this.props.confirm_code}</Text>
                  </Text>
                </View>
              }

            </View>


          </View>

          <Image style={{height: 101, width : 101, borderRadius:2, margin: 2}} source={{uri: this.props.post.image_url_0}}/>

        </View>
          <View style={{flexDirection:'row'}}>
            {this.props.post.post_type === 2 && this.props.type === 'SO' &&
              <View style={styles.baseRectangleBorderedStyle}>
                <Text> تومان</Text>
                <Text>{EnglishNumberToPersianPrice(this.props.post.auction.highest_suggest)}</Text>
                <Text style={{fontSize:12}}>مبلغ پیشنهاد: </Text>

              </View>
            }
            {this.props.type === 'SO' && this.props.status === 'pe' &&
              <TouchableNativeFeedback
                onPress={()=>{this.props.showDeliverModal(this.props)}}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                <View style={styles.blueRectangleStyle}>
                  <Text style={{color:'white'}}>تحویل</Text>
                  <Icon name='done' color='#ffffff' size={26}/>
                </View>
              </TouchableNativeFeedback>
            }
          </View>

          {this.props.type == 'BO' && this.props.status == 'ca' &&
            <Text style={{padding: 5, color:'green'}}>
              <Text>مبلغ </Text>
              <Text>{EnglishNumberToPersianPrice(this.props.suspended_money)}</Text>
              <Text> به حساب شما بازگشت.</Text>
            </Text>
          }
          {this.props.type == 'BO' && this.props.status == 'pe' &&
            <View>
              <Text style={{padding: 5, color:'green'}}>
                <Text>مبلغ </Text>
                <Text>{EnglishNumberToPersianPrice(this.props.suspended_money)} </Text>
                <Text>از حساب شما کسر شد. لطفا پس از دریافت کالا کد تحویل را خدمت فروشنده دهید.</Text>
              </Text>
              {this.props.type == 'BO' && this.props.status == 'pe' && this.props.post.post_type ===2 &&
                <Text style={{padding: 5, color:'green'}}>در صورتی که پیشنهاد بالاتری از شما ثبت شود،  مبلغ کسر شده به شما باز خواهد گشت.</Text>
              }

              <Text style={{padding: 5, color:'green'}}>درصورت انصراف از خرید و یا مغایرت کالا با آگهی، از فروشنده درخواست لغو فروش کنید و یا تا اتمام مهلت تحویل صبر کرده و خرید خود را لغو کنید.</Text>
            </View>
          }

          {this.props.type == 'BO' && this.props.status == 'de' && this.props.post.total_invested_qeroons > 0 &&
            <View style={styles.baseRectangleBorderedStyle}>
              <Text style={{padding: 5, color:'green'}}>
                <Text>{EnglighNumberToPersian(this.props.post.total_invested_qeroons)}</Text>
                <Text>قرون به حساب شما اضافه شد.</Text>
              </Text>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.likeText}>{EnglighNumberToPersian(this.props.post.total_invested_qeroons)}</Text>
                <View style={{padding:1, width:19, height:19, margin:2 ,borderColor:'#000000', borderRadius: 9, borderWidth: 1, alignItems:'center', justifyContent:'flex-end'}}>
                  <Text style={{color:'#000000', fontWeight:'100', fontSize:12}}>ق</Text>
                </View>
              </View>
            </View>
          }
          {this.props.type == 'SO' && this.props.status == 'de' &&
            <View style={styles.baseRectangleBorderedStyle}>
              <Text style={{padding: 5, color:'green', flex:1}}>
                <Text>{EnglighNumberToPersian(this.props.suspended_money)}</Text>
                <Text> تومان به حساب شما اضافه شد.</Text>
              </Text>
              <Icon name='credit-card'/>
            </View>

          }

        </View>


      </Card>
    )
  }
}
const baseRectangleStyle = {
  padding: 5,
  borderRadius : 2,
  flex:1,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center' ,
  margin:4
}

const styles = StyleSheet.create({
  titleText :{
    fontWeight: 'bold',
    fontSize: 15
  },

  baseRectangleStyle :{
    ...baseRectangleStyle
  },
  baseRectangleBorderedStyle :{
    ...baseRectangleStyle,
    borderWidth:1,
    borderColor : 'green'
  },
  greenRectangleStyle : {
    ...baseRectangleStyle,
    backgroundColor: 'green'
  },
  deleteItemStyle: {
    ...baseRectangleStyle,
    backgroundColor:'gray',
    flex:0
  },
  blueRectangleStyle: {
    ...baseRectangleStyle,
    backgroundColor:'darkblue'
  },
  redRectangleStyle: {
    ...baseRectangleStyle,
    backgroundColor:'#C62828'
  },

   timeText:{
     padding:5,
     paddingRight:0,
     color:'#9E9E9E',
     fontWeight: '100',
     fontSize:11,
   }
})
