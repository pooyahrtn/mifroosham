import React, { Component } from 'react';
import {requestLocation} from '../utility/locationUtility.js';
import SInfo from 'react-native-sensitive-info';

export default class AbstractPostIncludedPage extends Component {
  token = undefined;

  constructor(props) {
    super(props)
    this.state = {
      current_location : undefined,
      show_invest_modal : false,
      selected_item_to_invest : undefined,
    }
  }

  componentDidMount(){
    let onSuccess = (res) =>{
      this.setState({current_location: res})
    }
    let onFailed = (error) =>{
      alert(error.message)
    }
    requestLocation(navigator, onSuccess, onFailed)
    SInfo.getItem('token', {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham'}).then(token => {
        if (token != null){
          this.token = token;
        }
      });
  }

  setSelectedItemToBuy = (item, reposter)=>{
    this.props.navigation.navigate('BuyItemPage', {post: item, token: this.token, reposter: reposter})
  }

  hideInvestModal= ()=>{
    this.setState({show_invest_modal: false, invest_loading:false})
  }

  openProfilePage = (username) =>{
   this.props.navigation.navigate('OtherProfilePage', {username})
  }

  openCommentPage = (post_uuid, post_title) =>{
    this.props.navigation.navigate('CommentPage', {token: this.token, post_uuid, post_title  })
  }

  showInvestModal = (post) => {
    this.setState({show_invest_modal: true, selected_item_to_invest: post})
  }
}
