import React, { PureComponent } from 'react';
import {Dimensions} from 'react-native';
import {getRemainingTimeText} from '../../utility/TimerUtil.js';
import {getDistanceInPersian} from '../../utility/DistanceUtil.js'

import Swiper from 'react-native-swiper';




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


export default class AbstractPostItem extends PureComponent {

  width = Dimensions.get('window').width;
  intervalId = undefined;

  constructor(props) {
    super(props);
    this.state = {
      
    }
    if (this.props.post.post_type === 2) {
      this.state = {...this.state, auction_remaining_time: getRemainingTimeText(this.props.post.auction.end_time)}
    }else if (this.props.post.post_type === 1) {
      this.state = {...this.state, discound_current_price: getCurrentPrice(this.props.post.discount.start_time, this.props.post.discount.end_time,
        this.props.post.discount.real_price, this.props.post.discount.start_price)};
    }
    if(this.props.width){
      this.width = this.props.width;
    }
  }

  componentDidMount(){
    if (this.props.post.post_type === 2) {

      intervalId = setInterval(() => {
        this.setState((prevState, props) => {
        return {auction_remaining_time: getRemainingTimeText(this.props.post.auction.end_time)};
        });
      }, 1000);
      // this.setState( {intervalId: intervalId});
      this.intervalId = intervalId
    }
    else if (this.props.post.post_type === 1) {

        intervalId = setInterval(() => {
        this.setState((prevState, props) => {
        return {discound_current_price: getCurrentPrice(this.props.post.discount.start_time, this.props.post.discount.end_time,
          this.props.post.discount.real_price, this.props.post.discount.start_price)};
        });
      }, 5000);
      // this.setState({intervalId: intervalId});
      this.intervalId = intervalId;
    }
    else {
      // this.setState({intervalId : undefined})
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(nextState.intervalId != )
  // }

    componentWillUnmount(){
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
}
