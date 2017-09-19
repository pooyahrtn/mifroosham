import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList, ActivityIndicator, AsyncStorage, Alert, PermissionsAndroid} from 'react-native';
import { Icon } from 'react-native-elements';
import PostItem from './postItem.js';
import {Container, Header, Title} from 'native-base';
import {base_url, read_feeds_url} from '../serverAddress.js';
import BuyItemPage from './buyItemPage.js';



export default class Main extends Component{

  static navigationOptions = {
    tabBarLabel: 'خانه',
  }


  constructor(props){
    super(props);
    this.state = {
      data: null,
      loading: false,
      next_page : base_url,
      error : null,
      refreshing : false,
      page :1,
      token : null,
      visit_version : 0,
      current_location : undefined,
      selected_item_to_buy : undefined,
      show_send_modal : false,
    };
  }

  componentWillMount(){

  }

  componentDidMount(){
    AsyncStorage.getItem('@Token:key')
    .then( (value) =>{
        if (value != null){
          this.setState({token: value})
          this.makeRemoteRequest(value)
        } else{
          this.props.navigation.navigate('Authentication')
        }
      }
    );
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
              Alert.alert('hoora')
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
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false,
          next_page : res.next,
          visit_version : res.visit_version
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
      });
  };

  handleRefresh = () => {
    _uuids = []
    len = this.state.data.length;
    for (i in this.state.data) {
      feed = this.state.data[len - i - 1]
      if (!feed.read) {
        _uuids.push(feed.uuid)
      }
    }
     this.setState(
       {
         page: 1,
         refreshing: true
       },
       () => {

         fetch(read_feeds_url,
           {
             method: 'POST',
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization': 'Token ' + this.state.token
             },
             body: JSON.stringify({
               visiting_version : this.state.visit_version,
               uuids : _uuids
             })
           }
         )
           .then(res => {
             console.log(_uuids);
             if (res.status === 200) {
             this.makeRemoteRequest(this.state.token)
           }})
           .catch(error => {
             this.setState({ error, loading: false });
             console.log(error);
           });
       }
     );
   };

  handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          setTimeout(()=>this.makeRemoteRequest(this.state.token), 5000)
        }
      );
    };

  openProfilePage(user_id){
    this.props.userSelected(user_id);
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

  setSelectedItemToBuy = (item)=>{
    this.props.navigation.navigate('BuyItemPage', {post: item})
  }

  render(){
    return(
      <View style={{flex:1}}>
        <Modal
          transparent={true}
          visible={this.state.show_send_modal}
          onRequestClose={() => {this.setState({show_send_modal: !this.state.show_send_modal})}}
          animationType="slide"
          >
          <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}/>
        </Modal>
        <Header androidStatusBarColor="#263238" style={{backgroundColor: '#37474F'}}>
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' ,flex:1}} >
            <Icon name='inbox' onPress={()=>{this.setState({show_send_modal: true})}} color='white' size={31} />
          </View>
          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:2}}>
              <Title style={{ color: '#ffffff', fontWeight:'bold'}}>selmino</Title>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' ,flex:1}}>
            <Icon name="add-circle-outline" color='#ffffff'
             onPress={()=>{this.props.navigation.navigate('TakePhotoPage', {token: this.state.token})}}
             size={31}/>
          </View>
        </Header>
        <View style={{flex:1}}>
          <FlatList data={this.state.data}
            keyExtractor={item => item.uuid}
            refreshing = {this.state.refreshing}
            onRefresh={()=>this.handleRefresh()}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={4}
            initialNumToRender={4}
            extraData={this.state}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
              <PostItem
                {...item}
                setSelectedItemToBuy = {this.setSelectedItemToBuy}
                token = {this.state.token}
                current_location = {this.state.current_location}
                openProfilePage = {this.props.openProfilePage}
              />
            }/>
        </View>
      </View>
    )
  }
}



// function mapStateToProps(state){
//   return{
//     token : state.activeToken
//   };
// }
//
// function matchDispatchToProps(dispatch){
//   return bindActionCreators({}, dispatch)
// }
//
// export default connect(mapStateToProps, matchDispatchToProps)(Main);
