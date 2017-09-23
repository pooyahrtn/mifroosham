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
      end_time : end_time,
      intervalId : undefined
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
            {this.props.type === 'SO' && this.props.status === 'pe' && (<Text style={{color: '#009688'}}> فروخته شد</Text>)}
            {this.props.type === 'BO' && this.props.status === 'pe' && this.props.post.post_type === 2 &&  (<Text style={{color: '#009688'}}>پینشهاد شما ثبت شد</Text>)}
            {this.props.type === 'BO' && this.props.status === 'pe' && this.props.post.post_type !== 2 && (<Text style={{color: '#009688'}}> خریده شد</Text>)}
            {this.props.status === 'de' && this.props.type === 'SO' &&(<Text style={{color: '#009688'}}> تحویل داده شد</Text>)}
            {this.props.status === 'de' && this.props.type === 'BO' &&(<Text style={{color: '#009688'}}>تحویل گرفته شد </Text>)}
            {this.props.status === 'ca' && this.props.type === 'BO' && !this.props.auction_failed &&(<Text style={{color: '#009688'}}>فروشنده فروش را لغو کرد</Text>)}
            {this.props.status === 'ca' && this.props.type === 'BO' && this.props.auction_failed &&(<Text style={{color: '#009688'}}>پیشنهادی بالاتر از شما ثبت شد</Text>)}
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

              <Text style={{padding: 4, flex:1, textAlign:'right'}}>{this.props.buyer.profile.full_name}</Text>
              <Thumbnail small source={{uri: this.props.buyer.profile.avatar_url}}/>
            </View>
            {this.props.type==='SO' && ( <Text style={{paddingTop: 2, fontSize:12}}> این کالا را خریداری کرد. </Text>)}
            {this.props.status === 'pe' && this.props.post.post_type !== 2 &&
              <View style={styles.timerContainer}>
                <Text>{EnglighNumberToPersian(this.state.remaining_time.text)}</Text>
                <Text style={{fontSize:12}}> مهلت تحویل : </Text>
                <Icon type='evilicon'  name='clock' color='#009688' size={20}/>
              </View>
            }
            {this.props.status === 'pe' && this.props.post.post_type === 2 &&
              <View style={styles.timerContainer}>
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
                  <View style={styles.deleteButton}>
                    <Icon name='delete' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>

              )}
              {this.props.rate_status === 'cr' &&
                <TouchableNativeFeedback
                  onPress={()=>{this.props.showReviewModal(this.props)}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={{borderRadius : 2, backgroundColor:'green', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center' , margin:4}}>
                    <Text style={{color:'white'}}>امتیاز دهید</Text>
                    <Icon name='star' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>
              }
              {this.props.rate_status === 'ra' &&
                <View style={{borderRadius : 2, backgroundColor:'blue', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', margin:4}}>
                  <Text style={{color:'white'}}>امتیاز داده شد</Text>
                  <Icon name='star' color='#ffffff' size={26}/>
                </View>
              }
              {this.props.type === 'BO' && this.props.status === 'pe' &&
                <TouchableNativeFeedback
                  onPress={()=>{}}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                  <View style={{borderRadius : 2, backgroundColor:'green', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center' , margin:4}}>
                    <Text style={{color:'white'}}>تماس</Text>
                    <Icon name='phone' color='#ffffff' size={26}/>
                  </View>
                </TouchableNativeFeedback>

              }
              {this.props.type === 'BO' && this.props.status === 'pe' &&
                <View style = {{ padding:3,
                 margin:4,
                 flexDirection:'row',
                 alignItems: 'center',
                 borderRadius: 2,
                 borderWidth: 1,
                 justifyContent: 'center',
                 borderColor: '#009688',
                 flex:2
                }}>
                  <Text>
                    <Text>کد تحویل: </Text>
                    <Text>{this.props.confirm_code}</Text>
                  </Text>
                </View>
              }

            </View>


          </View>

          <Image style={{height: 90, width : 90, borderRadius:2, margin: 2}} source={{uri: this.props.post.image_url_0}}/>

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
            <Text style={{padding: 5, color:'green'}}>
              <Text>{EnglighNumberToPersian(this.props.post.total_invested_qeroons)}</Text>
              <Text>قرون به حساب شما اضافه شد.</Text>
            </Text>
          }

        </View>


      </Card>
    )
  }
}

const styles = StyleSheet.create({
  titleText :{
    fontWeight: 'bold',
    fontSize: 15
  },
  callBuyerButton:{
    flex:1,
    backgroundColor:'#00838F',
    flexDirection:'row',
    margin: 3,
    padding:5,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  deleteButton:{
    backgroundColor:'#BDBDBD',
    flexDirection:'row',
    margin: 4,
    padding:1,
    alignItems: 'center',
    borderRadius: 2,
    justifyContent: 'center',
  },
  confirmDeliver:{
    flex:1,
    backgroundColor:'#C2185B',
    flexDirection:'row',
    margin: 3,
    padding:5,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',

  },
  buyAttensionText:{
    fontSize:14,
    fontWeight: 'bold',
    color: '#009688',
    padding: 5,

  },
  sellAttensionText:{
    fontSize:14,
    fontWeight: 'bold',
    color: '#E53935',
    padding: 5,

  },
  timerContainer: {
   padding:3,
   margin:4,
   flexDirection:'row',
   alignItems: 'center',
   borderRadius: 2,
   borderWidth: 1,
   justifyContent: 'center',
   borderColor: '#009688'
   },
   timeText:{
     padding:5,
     paddingRight:0,
     color:'#9E9E9E',
     fontWeight: '100',
     fontSize:11,
   }
})
