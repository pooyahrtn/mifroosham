
import React, { Component } from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Image, View, Text,
  TouchableWithoutFeedback, ActivityIndicator, StatusBar, Dimensions, ScrollView, Modal} from 'react-native';
import {bindActionCreators} from 'redux';
import { Card ,  Thumbnail, Button, Header, Title, Toast} from 'native-base';
import { Icon } from 'react-native-elements';
import {countText, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {phonecall} from 'react-native-communications'
import SInfo from 'react-native-sensitive-info';
import {updatePost} from '../requestServer.js';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js';
import {getRemainingTimeText, getTimeAgo} from '../utility/TimerUtil.js';
import Swiper from 'react-native-swiper';
import PostItem from './PostItem/postItem.js'
import {requestLocation} from '../utility/locationUtility.js';
import { updateProfilePost} from '../actions/profilePostActions.js';
import InvestComponent from './InvestComponent.js';
import AbstractPostIncludedPage from './AbstractPostIncludedPage.js';


class PostDetailPage extends AbstractPostIncludedPage{
  profilePost = this.props.navigation.state.params.profilePost;
  user = this.props.navigation.state.params.user;

  constructor(props){
    super(props);
    this.state ={
      ...this.state,
      post : this.profilePost.post,
      // current_location: undefined,
      my_username: undefined,
      // show_invest_modal: false,
    }
  }

  openProfilePage = (username) =>{

  }



  setSelectedItemToBuy = (item, reposter)=>{
    this.props.navigation.navigate('BuyItemPage', {post: item, token: this.token, reposter: reposter})
  }

  componentDidMount(){
    super.componentDidMount()

    SInfo.getItem('username', {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham'}).then(my_username => {
        if (my_username != null){
          this.setState({my_username})
        } else{
          this.props.navigation.navigate('Authentication')
        }
      });
  }

  updatePost = (post)=>{
    this.setState({post})
    this.props.updateProfilePost(post.sender.username, post)
    this.props.updateProfilePost(this.state.my_username, post)
  }

  // hideInvestModal= ()=>{
  //   this.setState({show_invest_modal: false, invest_loading:false})
  // }

  loadingTopCompeleted = ()=>{
    this.setState({invest_loading: false})

  }



  render(){
    return(
      <View style={{flex:1}}>
        <Header style={{backgroundColor: '#F5F5F5'}}>
          <StatusBar
             backgroundColor="#e0e0e0"
             barStyle="dark-content"
           />
          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:1}}>
            <Title style={{ color: 'black', fontWeight:'bold'}}>{this.state.post.title}</Title>
          </View>
        </Header>
        {this.profilePost.post.ads_included &&
          <Modal
            transparent={true}
            visible={this.state.show_invest_modal}
            onRequestClose={() => {this.setState({show_invest_modal: !this.state.show_invest_modal})}}
            animationType="fade"
            >
            <InvestComponent
              selected_item_to_invest = {this.profilePost.post}
              updatePost = {this.updatePost}
              hideInvestModal = {this.hideInvestModal}
              token = {this.token}
              loadingTopCompeleted = {this.loadingTopCompeleted}
            />
          </Modal>
        }
        <ScrollView>
          <PostItem
            {...this.profilePost}
            post = {this.state.post}
            buyable = {this.state.username !== this.state.my_username}
            reposter = {this.profilePost.is_repost && this.user }
            setSelectedItemToBuy = {this.setSelectedItemToBuy}
            showInvestModal = {this.showInvestModal}
            token = {this.token}
            current_location = {this.state.current_location}
            openCommentPage = {this.openCommentPage}
            openProfilePage = {this.openProfilePage}
          />
        </ScrollView>

      </View>

    )
  }


}


const styles = StyleSheet.create({
  postImage:{
    width: null ,
    height: Dimensions.get('window').width
  }
})


function mapStateToProps(state){
  return{

  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({updateProfilePost}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(PostDetailPage);
