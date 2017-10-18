import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList, ActivityIndicator,
  AsyncStorage, Alert, PermissionsAndroid, Text, TextInput, TouchableWithoutFeedback, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import PostItem from './PostItem/postItem.js';
import {Container, Header, Title, Toast} from 'native-base';
import {base_url, read_feeds_url, invest_helps_url, request_invest_url, posts_url} from '../serverAddress.js';
import BuyItemPage from './buyItemPage.js';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js'
import {initData, loadMore, updatePost} from '../actions/feedsActions.js'
import {setUnreadNotifications} from '../actions/notificationActions.js'
import {requestLocation} from '../utility/locationUtility.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {initBoughtTransactions, initSoldTransactions, getTransactionNotifications,getFeeds } from '../requestServer.js';
import {initBoughtData, initSoldData} from '../actions/transactionsActions.js';
import SInfo from 'react-native-sensitive-info';
import InvestComponent from './InvestComponent.js';

class Main extends Component{

  static navigationOptions = {
    tabBarLabel: 'خانه',
  }


  constructor(props){
    super(props);
    this.state = {
      loading: false,
      next_page : base_url,
      error : null,
      refreshing : false,
      page :1,
      token : null,
      current_location : undefined,
      show_invest_modal : false,
      selected_item_to_invest : undefined,
      my_username : undefined,
    };
  }

  componentWillMount(){

  }

  updateTransactions(type, data){
      if(type === 'BO'){
        this.props.initBoughtData(data)
      }else{
        this.props.initSoldData(data)
      }
  }

  setNewNotificationsNumber(res){
    this.props.setUnreadNotifications(res.count)
  }

  componentDidMount(){
    SInfo.getItem('token', {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham'}).then(value => {
        if (value != null){
          this.handleRefresh(value)

          initBoughtTransactions(value, (res) => {this.updateTransactions('BO', res)}, (error) => {})
          initSoldTransactions(value, (res) => {this.updateTransactions('SO', res)}, (error) => {})
          getTransactionNotifications(value, (res) => {this.setNewNotificationsNumber(res)}, (error) =>{})
          this.setState({token: value})
        } else{
          this.props.navigation.navigate('Authentication')
        }
      });
    SInfo.getItem('username', {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham'}).then(my_username => {
        if (my_username != null){
          this.setState({my_username})
        } else{
          this.props.navigation.navigate('Authentication')
        }
      });

    let onSuccess = (res) =>{
      this.setState({current_location: res})
    }
    let onFailed = (error) =>{
      alert(error.message)
    }
    requestLocation(navigator, onSuccess, onFailed)

    if(this.props.notification){
      this.props.navigation.navigate('InboxTabPage', {token: this.state.token})
    }
  }





  makeRemoteRequest = (token) => {
    const { page } = this.state;
    this.setState({ loading: true });
    next_page = base_url;
    if(page !== 1){
      next_page = this.state.next_page
    }

    let onSuccess = (res)=>{
      if (page === 1){
        this.props.initData(res.results)
      }else{
        this.props.loadMore(res.results)
      }
      this.setState({
        error: res.error || null,
        loading: false,
        refreshing: false,
        next_page : res.next
      });
    }
    let onFailed = (error) =>{
      this.setState({ error, loading: false });
      console.log(error);
    }
    getFeeds(token, next_page, onSuccess, onFailed)
  };


  handleRefresh = (token) => {

     this.setState(
       {
         page: 1,
         refreshing: true
       },
       () => {
        this.makeRemoteRequest(token)
       }
     );
   };

  handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          this.makeRemoteRequest(this.state.token)
        }
      );
    };



  openProfilePage = (username) =>{
   this.props.navigation.navigate('OtherProfilePage', {username})
  }
  renderFooter = () => {
      if (!this.state.loading) return null;
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

  setSelectedItemToBuy = (item, reposter)=>{
    this.props.navigation.navigate('BuyItemPage', {post: item, token: this.state.token, reposter: reposter})
  }
  openCommentPage = (post_uuid, post_title) =>{
    this.props.navigation.navigate('CommentPage', {token: this.state.token, post_uuid, post_title  })
  }

  showInvestModal= (item)=>{
    this.setState({invest_loading:true, show_invest_modal: true, selected_item_to_invest: item})
  }



  updatePost = (post)=>{
    this.props.updatePost(post)
  }

 hideInvestModal= ()=>{
   this.setState({show_invest_modal: false, invest_loading:false})
 }

 loadingTopCompeleted = ()=>{
   this.setState({invest_loading: false})
 }

  render(){
    return(
      <View style={{flex:1 }}>
        {this.state.selected_item_to_invest &&
          <Modal
            transparent={true}
            visible={this.state.show_invest_modal}
            onRequestClose={() => {this.setState({show_invest_modal: !this.state.show_invest_modal})}}
            animationType="fade"
            >
            <InvestComponent
              selected_item_to_invest = {this.state.selected_item_to_invest}
              updatePost = {this.updatePost}
              hideInvestModal = {this.hideInvestModal}
              token = {this.state.token}
              loadingTopCompeleted = {this.loadingTopCompeleted}
            />
          </Modal>
        }

        <Header style={{backgroundColor: '#F5F5F5'}}>
          <StatusBar
             backgroundColor="#e0e0e0"
             barStyle="dark-content"
           />
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' }} >
            {this.props.newMessages > 0 ?
              (
                <TouchableWithoutFeedback onPress={()=>{this.props.navigation.navigate('InboxTabPage', {token: this.state.token})}}>
                  <View style={{borderRadius: 15, height: 30 , backgroundColor:'red', alignItems:'center', justifyContent:'center', width: 60}}>
                    <Text style={{color:'white', fontSize:18 , fontWeight:'bold'}}>{EnglighNumberToPersian(this.props.newMessages)}</Text>
                  </View>
                </TouchableWithoutFeedback>

              )
              :
              (
                <Icon name='inbox' style={{padding:5}} onPress={()=>{this.props.navigation.navigate('InboxTabPage', {token: this.state.token})}} size={31} />
              )}

          </View>
          <View style={{width: 31}}>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:1}}>
              <Title style={{ color: 'black', fontWeight:'bold'}}>selmino</Title>
          </View>
          <View style={{width:31, justifyContent:'center'}}>
            {this.state.invest_loading &&
              <ActivityIndicator animating size="large"/>
            }
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' }}>
            <Icon name="add-circle-outline" style={{padding:5}}
             onPress={()=>{this.props.navigation.navigate('TakePhotoPage', {token: this.state.token})}}
             size={31}/>
          </View>
        </Header>

          <FlatList data={this.props.data}
            keyExtractor={item => item.uuid}
            refreshing = {this.state.refreshing}
            onRefresh={()=>this.handleRefresh(this.state.token)}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={4}
            initialNumToRender={4}
            extraData={this.state}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
              <PostItem
                {...item}
                updatePost = {this.props.updatePost}
                setSelectedItemToBuy = {this.setSelectedItemToBuy}
                showInvestModal = {this.showInvestModal}
                token = {this.state.token}
                current_location = {this.state.current_location}
                openProfilePage = {this.openProfilePage}
                openCommentPage = {this.openCommentPage}
              />
            }/>

      </View>
    )
  }
}



function mapStateToProps(state){
  return{
    data : state.feedsReducer,
    notification : state.notificationReducer,
    newMessages : state.unreadNotificationsReducer,
    // notReadFeeds : state.notReadFeedsReducer
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({initData, loadMore, updatePost, initBoughtData, initSoldData, setUnreadNotifications}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Main);
