import React, { Component } from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import { Card ,  Thumbnail} from 'native-base';
import { Icon, Button } from 'react-native-elements';
import {EnglighNumberToPersian, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {getTimeAgo} from '../utility/TimerUtil.js';

export default class DeliverItem extends Component{


  render(){
    return(
      <Card style={{flexDirection: 'row', justifyContent: 'flex-end', padding:5}}>
        <Image style={{height: 70 * this.props.image_height_to_width_ratio, width : 70, margin: 5}} source={{uri: this.props.image_url}}/>
        <View style={{flex:1, flexDirection:'column', justifyContent:'flex-start'}}>
          <View style={{ flexDirection:'row', alignItems:'center'}}>
            <Text style={styles.descriptionText}>
              <Text style={{fontWeight: 'bold'}}>{this.props.user.full_name}</Text>
              {this.props.type === 'like' && <Text> پست شما را پسندید.</Text>}
              {this.props.type === 'follow' && <Text> شما را دنبال کرد.</Text>}
              {this.props.type === 'share' && <Text style={styles.descriptionText}> پست شما را به اشتراک گذاشت.</Text>}
              <Text style= {styles.timeText}> {EnglighNumberToPersian(getTimeAgo(this.props.time))}</Text>
            </Text>
            <Thumbnail small source={{uri: this.props.user.avatar_url}}/>
          </View>
        </View>
      </Card>
    )
  }
}


const styles = StyleSheet.create({
  descriptionText:{
    flex:1,
    flexWrap : 'wrap',
    padding:5,
  },
  timeText:{
    textAlign:'auto',
    padding:5,
    color:'#9E9E9E',
    fontWeight: '100',
    fontSize:11,
    flex:1,
  }
})
