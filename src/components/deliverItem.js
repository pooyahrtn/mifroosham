import React, { Component } from 'react';
import {StyleSheet, View, Image, TouchableNativeFeedback, Platform, Dimensions, Text} from 'react-native';
import { Card ,  Thumbnail} from 'native-base';
import { Icon, Button, Divider } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import ParsedText from 'react-native-parsed-text';
import {phonecall} from 'react-native-communications'
import {getRemainingTimeText} from '../utility/TimerUtil.js';
import {getTimeAgo} from '../utility/TimerUtil.js';


export default class DeliverItem extends Component{


  componentDidMount(){
    intervalId = setInterval(() => {
     this.setState((prevState, props) => {
       return {remaining_time: getRemainingTimeText(this.props.end_time)};
     });
    }, 1000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }

  constructor(props){
    super(props);
    this.state = {remaining_time: getRemainingTimeText(this.props.end_time)};

  }

  render(){
    return(
      <Card style={{}}>
        <Text style={styles.titleText}>
          <Text style={{textDecorationLine: 'underline'}}>{this.props.title}</Text>
          {this.props.type === 'sell' && (<Text style={{color: '#009688'}}> فروخته شد!</Text>)}
          {this.props.type === 'buy' &&(<Text style={{color: '#009688'}}> خریده شد!</Text>)}
          {this.props.type === 'deliver' &&(<Text style={{color: '#009688'}}> تحویل داده شد!</Text>)}
         </Text>
        <Divider style={{ backgroundColor: '#eeeeee', margin:2 }} />
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{ flexDirection: 'column', alignItems:'stretch', flex:1}}>
            <View style={{ flexDirection: 'row', justifyContent:'flex-end',padding: 1, alignItems:'center'}}>
              <Text style={{padding: 4}}>{this.props.buyer.full_name}</Text>
              <Thumbnail small source={{uri: this.props.buyer.avatar_url}}/>
            </View>
            {this.props.type==='sell' && ( <Text style={{paddingTop: 2, fontSize:12}}> این کالا را خریداری کرد. </Text>)}
            {(this.props.type === 'sell' || this.props.type === 'buy')&&
              (<View style={styles.timerContainer}>
                <Text>{EnglighNumberToPersian(this.state.remaining_time.text)}</Text>
                <Text style={{fontSize:12}}> مهلت تحویل : </Text>
                <Icon type='evilicon'  name='clock' color='#009688' size={20}/>
              </View>)
          }

            <Text style= {styles.timeText}> {EnglighNumberToPersian(getTimeAgo(this.props.time))}</Text>
            {this.props.type === 'deliver' && (
              <TouchableNativeFeedback
                onPress={()=>{}}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                <View style={styles.deleteButton}>
                  <Text style={{fontWeight: 'bold', fontSize: 15, color: '#ffffff'}}>حذف</Text>
                  <Icon name='delete' color='#ffffff' size={28}/>
                </View>
              </TouchableNativeFeedback>
            )}
          </View>
          <Image style={{height: 90, width : 90, margin: 5}} source={{uri: this.props.image_url}}/>
        </View>
        {this.props.type === 'sell'&& (  <Text style={styles.sellAttensionText}>
          حتما هنگام تحویل، از خریدار درخواست تایید دریافت کنید، در غیر این صورت مبلغ کالا به حساب شما واریز نخواهد شد.</Text>)}
        {this.props.type === 'buy'&& <Text style={styles.buyAttensionText}>لطفا هنگام دریافت کالا، پس از بررسی کامل و اطمینان ، دکمه ی تایید دریافت را بزنید. در غیر این صورت فروشنده میتواند کالا را تحویل ندهد.</Text>}
        {this.props.type === 'buy' && (
          <TouchableNativeFeedback
            onPress={()=>{}}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
            <View style={styles.confirmDeliver}>
              <Text style={{fontWeight: 'bold', fontSize: 15, color: '#ffffff'}}>تایید دریافت</Text>
              <Icon name='done-all' color='#ffffff' size={28}/>
            </View>
          </TouchableNativeFeedback>
        )}
        {(this.props.type === 'sell' || this.props.type === 'buy')&&
          <TouchableNativeFeedback
            onPress={()=>{phonecall(this.props.buyer.phone_number, true)}}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
            <View style={styles.callBuyerButton}>
              <Text style={{fontWeight: 'bold', fontSize: 15, color: '#ffffff'}}>تماس</Text>
              <Icon name='call' color='#ffffff' size={28}/>
            </View>
          </TouchableNativeFeedback>
        }


      </Card>
    )
  }
}


const styles = StyleSheet.create({
  titleText :{
    padding: 5,
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
    borderRadius: 5,
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
   margin:2,
   flexDirection:'row',
   alignItems: 'center',
   borderRadius: 5,
   borderWidth: 1,
   justifyContent: 'center',
   borderColor: '#009688'
   },
   timeText:{
     padding:5,
     color:'#9E9E9E',
     fontWeight: '100',
     fontSize:11,
     flex:1,
   }
})
