import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList, ActivityIndicator,
  AsyncStorage, Alert, PermissionsAndroid, Text, TextInput, TouchableWithoutFeedback, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import PostItem from './postItem.js';
import {Container, Header, Title, Toast} from 'native-base';
import {base_url, read_feeds_url, invest_helps_url, request_invest_url, posts_url} from '../serverAddress.js';
import BuyItemPage from './buyItemPage.js';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js'
import {initData, loadMore, updatePost} from '../actions/feedsActions.js'
import {setUnreadNotifications} from '../actions/notificationActions.js'
// import {addFeed, clearData} from '../actions/notReadFeedsActions.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {initBoughtTransactions, initSoldTransactions, getTransactionNotifications,updatePost as requestUpdatePost } from '../requestServer.js';
import {initBoughtData, initSoldData} from '../actions/transactionsActions.js';
import SInfo from 'react-native-sensitive-info';

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
      visit_version : 0,
      current_location : undefined,
      show_invest_modal : false,
      invest_helps : undefined,
      selected_item_to_invest : undefined,
      invest_loading: false,
      requested_invest_qeroons : 0,
      request_invest_loading : false,
      requested_invest_qeroons_is_zero: false,
      remaining_qeroons_are_less_than_request : false,
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

    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((res) => {
      if (!res) {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'اجازه دستیابی به موقعیت مکانی',
            'message': 'برای نشان دادن فاصله ی پست ها از شما این دسترسی لازم است.'
          }
        ).then(
          (granted) => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            }else {
              //TODO: show why we need location Permission
            }
          }
        )
      }else {
        navigator.geolocation.getCurrentPosition(
         (position) => {
          let latitude = Math.round(position.coords.latitude * 100) / 100
          let longitude = Math.round(position.coords.longitude * 100) / 100
          this.setState({current_location: {latitude: latitude, longitude: longitude}})
         },
         (error) => alert(error.message),
         { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
      }
    })

    if(this.props.notification){
      this.props.navigation.navigate('InboxTabPage', {token: this.state.token})
    }
  }





  makeRemoteRequest = (token) => {
    const { page } = this.state;
    this.setState({ loading: true });
    next_url = ''
    if (page === 1) {
      next_url = base_url
    }else{
      next_url = this.state.next_page
    }

    fetch(next_url,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        }
      }
    )
      .then(res => res.json())
      .then(res => {

        if (page === 1){
          this.props.initData(res.results)
        }else{
          this.props.loadMore(res.results)
        }

        this.setState({
          error: res.error || null,
          loading: false,
          refreshing: false,
          next_page : res.next,
          visit_version : res.visit_version
        }, ()=>{this.props.addFeed(res.results)});
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
      });
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
    this.setState({invest_loading:true, requested_invest_qeroons:0, remaining_qeroons_are_less_than_request: false })
    fetch(invest_helps_url,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token
        }
      }
    ).then(res => res.json())
    .then(
      resjes =>{
        this.setState({
          invest_helps: resjes,
          selected_item_to_invest: item,
          show_invest_modal: true,
          invest_loading: false,
        })
      }
    ).catch(error =>
      this.setState({error: error})
    )

  }
  requestInvestOnPost =(post, qeroons) =>{
    if(qeroons === 0){
      this.setState({requested_invest_qeroons_is_zero: true})
      return
    }
    if(this.state.request_invest_loading){
      return
    }
    this.setState({request_invest_loading:true})
    fetch(request_invest_url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token
        }, body : JSON.stringify(
          {
            post_uuid: post.uuid,
            value : qeroons
          }
        )
      }
    ).then(res => {
      if(res.status === 200){
        this.setState({request_invest_loading: false, show_invest_modal: false})
        Toast.show({
                text: 'سرمایه گذاری شد.',
                position: 'bottom',
                duration : 3000,
                type: 'success'
              })
        this.updatePost(post)
      }else if(res.status === 403){
        this.setState({request_invest_loading: false, show_invest_modal: false})
        Toast.show({
                text: 'این پست خریده یا غیر فعال شده است.',
                position: 'bottom',
                duration : 3000,
                type: 'danger'
              })
      }else if(res.status === 410){
        this.refreshSelectedPostToInvest(post)
        this.setState({remaining_qeroons_are_less_than_request : true})
      }else if (res.status === 400) {
        this.setState({request_invest_loading: false, show_invest_modal: false})
        Toast.show({
                text: 'خطایی بوجود آمد. لطفا مجددا تلاش کنید.',
                position: 'bottom',
                duration : 3000,
                type: 'danger'
              })
      }
    })
  .catch(error =>
      this.setState({error: error})
    )
  }

  refreshSelectedPostToInvest = (post)=>{
    this.setState({refreshin_selected_post_to_invest: true})
    onSuccess = (res) =>{
      this.setState({selected_item_to_invest: res, refreshin_selected_post_to_invest: false})
    }
    onError = (error) =>{
      this.setState({refreshin_selected_post_to_invest: false})
      Toast.show({
              text: 'خطایی بوجود آمد',
              position: 'bottom',
              duration : 3000,
              type: 'danger'
            })
    }
    requestUpdatePost(this.state.token, post.uuid, onSuccess, onError)

  }
  updatePost = (post)=>{
    this.setState({refreshin_selected_post_to_invest: true})
    onSuccess = (res) =>{
      this.props.updatePost(res)
    }
    onError = (error) =>{
      console.error(error)
      Toast.show({
              text: 'خطایی بوجود آمد',
              position: 'bottom',
              duration : 3000,
              type: 'danger'
            })
    }
    requestUpdatePost(this.state.token, post.uuid, onSuccess, onError)

  }



  render(){
    return(
      <View style={{flex:1}}>
        {this.state.invest_helps && this.state.selected_item_to_invest &&
          <Modal
            transparent={true}
            visible={this.state.show_invest_modal}
            onRequestClose={() => {this.setState({show_invest_modal: !this.state.show_invest_modal})}}
            animationType="fade"
            >
            <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
              <View style={{borderRadius: 2, backgroundColor:'white', padding:5, margin: 5}}>
                <Text style={{textAlign:'center', color:'green', fontWeight:'bold', padding: 5, margin:5}}>سرمایه گذاری</Text>
                <Text style={{borderRadius:2,backgroundColor:'#e0e0e0',padding: 7, textAlign:'center', margin:3}}>
                  <Text>قرون های شما: </Text>
                  <Text>{EnglighNumberToPersian(this.state.invest_helps.your_qeroons)}</Text>
                  <Text> قرون</Text>
                </Text>
                <View style={{borderRadius:2, backgroundColor:'#e0e0e0',padding: 7,  margin:3, flexDirection:'row', alignItems:'center'}}>
                  {this.state.refreshin_selected_post_to_invest ?
                    <ActivityIndicator/>
                    :
                    <Icon name='refresh' onPress = {()=> this.refreshSelectedPostToInvest(this.state.selected_item_to_invest)}/>
                  }
                  {this.state.selected_item_to_invest.remaining_qeroons > 0 ?
                    (  <Text style={{flex:1 ,textAlign:'center',}} >
                        <Text>قرون های باقی مانده ی این پست: </Text>
                        <Text>{EnglighNumberToPersian(this.state.selected_item_to_invest.remaining_qeroons)}</Text>
                        <Text> قرون</Text>
                      </Text>)
                    :
                    (  <Text style={{flex:1 ,textAlign:'center',color:'red'}} >
                        <Text>از این پست قرونی باقی نمانده</Text>
                      </Text>
                    )
                  }

                </View>
                <View style={{borderRadius:2, backgroundColor:'#e0e0e0',padding: 7,  margin:3, flexDirection:'row', alignItems:'center'}}>
                  {this.state.refreshin_selected_post_to_invest ?
                    <ActivityIndicator/>
                    :
                    <Icon name='refresh' onPress = {()=> this.refreshSelectedPostToInvest(this.state.selected_item_to_invest)}/>
                  }

                  <Text style={{flex:1 ,textAlign:'center',}} >
                    <Text>قرون های سرمایه گذاری شده روی پست:‌</Text>
                    <Text>{EnglighNumberToPersian(this.state.selected_item_to_invest.total_invested_qeroons)}</Text>
                    <Text> قرون</Text>
                  </Text>
                </View>
                {this.state.selected_item_to_invest.remaining_qeroons !== 0 &&
                  <View style={{alignItems:'center', padding: 7,margin:3, borderRadius:2, borderWidth:1, borderColor:'#e0e0e0'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text>قرون</Text>
                    <TextInput onChangeText={(text)=>{this.setState({requested_invest_qeroons: text, requested_invest_qeroons_is_zero:false})}}
                      keyboardType='numeric' placeholder='مقدار سرمایه گذاری' style={{flex:1, textAlign:'center'}}/>
                    </View>
                    {this.state.requested_invest_qeroons > 0 &&
                      <Text style={{fontSize:12}}>
                        <Text>سودی که با فروش این پست بدست می آورید: </Text>
                        <Text style={{color:'green'}}>{EnglighNumberToPersian(this.state.invest_helps.qeroon_value * this.state.requested_invest_qeroons)}</Text>
                        <Text> تومان</Text>
                      </Text>
                    }

                    {parseInt(this.state.requested_invest_qeroons) > this.state.invest_helps.your_qeroons &&
                      <Text style={{color:'red', fontSize:12}}>این مقدار بیشتر از قرون های شماست.</Text>
                    }
                    {parseInt(this.state.requested_invest_qeroons) > this.state.selected_item_to_invest.remaining_qeroons &&
                      <Text style={{color:'red', fontSize:12}}>این مقداری بیشتر از قرون های باقی مانده از پست است.</Text>
                    }
                    {this.state.requested_invest_qeroons_is_zero &&
                      <Text style={{color:'red', fontSize:12}}>مقدار سرمایه گذاری نمیتواند صفر باشد.</Text>
                    }
                    {this.state.remaining_qeroons_are_less_than_request &&
                      <Text style={{color:'red', fontSize:12}}>این مقداری بیشتر از قرون های باقی مانده از پست است.</Text>
                    }
                  </View>
                }

                <View style={{flexDirection:'row', padding:1}}>
                  <TouchableWithoutFeedback onPress={()=>this.setState({show_invest_modal : false})}>
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', height:35 ,borderColor:'red',margin:2 ,borderWidth:1 ,borderRadius:2}}>
                      <Text style={{color: 'red'}}>بیخیال</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.selected_item_to_invest.remaining_qeroons > 0 &&
                    <TouchableWithoutFeedback onPress={()=> this.requestInvestOnPost(this.state.selected_item_to_invest, this.state.requested_invest_qeroons)}>
                      <View style={{flex:1, alignItems:'center', justifyContent:'center', height:35 ,backgroundColor:'green', margin:2 ,borderRadius:2}}>
                        {this.state.request_invest_loading ?
                          (
                            <Text style={{color:'white'}}>لطفا صبر کنید</Text>
                          ) :
                          (
                            <Text style={{color:'white'}}>خب</Text>
                          )}

                      </View>
                    </TouchableWithoutFeedback>
                  }

                </View>

              </View>
            </View>
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
        <View style={{flex:1}}>
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
                setSelectedItemToBuy = {this.setSelectedItemToBuy}
                updatedPosts = {this.state.updatedPosts}
                showInvestModal = {this.showInvestModal}
                token = {this.state.token}
                current_location = {this.state.current_location}
                openProfilePage = {this.openProfilePage}
                openCommentPage = {this.openCommentPage}
              />
            }/>
        </View>
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
