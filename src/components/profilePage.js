import React, { Component } from 'react';
import {connect} from 'react-redux';
import {FlatList, StyleSheet, Dimensions, Image, View, Text,
  TouchableWithoutFeedback, Linking, ActivityIndicator, StatusBar} from 'react-native';
import {bindActionCreators} from 'redux';
import { Card ,  Thumbnail, Button, Header, Title, Toast} from 'native-base';
import { Icon, Rating } from 'react-native-elements';
import {countText, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {phonecall} from 'react-native-communications'
import ImagePicker from 'react-native-image-crop-picker';
import SInfo from 'react-native-sensitive-info';
import {userDetail, userPosts, updateProfilePhoto, followUser} from '../requestServer.js';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js';
import {initProfilePost, loadMoreProfilePost, updateProfilePost} from '../actions/profilePostActions.js';
import {user_posts} from '../serverAddress.js'


class ProfilePage extends Component {

  static navigationOptions = {
    tabBarLabel: 'من',
  }


 componentDidMount(){
   SInfo.getItem('token', {
   sharedPreferencesName: 'mifroosham',
   keychainService: 'mifroosham'}).then(token => {

       if (token != null){
         SInfo.getItem('username', {
         sharedPreferencesName: 'mifroosham',
         keychainService: 'mifroosham'}).then(my_username => {
           isItMe = true;
           username = undefined;
           if(this.props.navigation.state.hasOwnProperty('params')){
              username= this.props.navigation.state.params.username
              isItMe = username === my_username
            }else{
              username = my_username;
            }
            this.setState({username, token, isItMe})
            this.userPostsRequest(token, username)
            this.userDetailRequest(token, username)
         });
       }
      else{
         this.props.navigation.navigate('Authentication')
       }
     });

 }
 constructor(props){
   super(props);

   this.state={
     next_page : user_posts,
     page : 1,
     username : undefined,
     isItMe : false,
     loading: false,
     error : null,
     refreshing : false,
     token : undefined,
     user : undefined
   }
 }

 handleRefresh = () => {

    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
       this.userPostsRequest(this.state.token, this.state.username)
      }
    );
  };


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

userDetailRequest = (token, username) =>{
  let onSuccess = (res)=>{
    this.setState({user: res})
  }
  let onFailed = (error)=>{

  }
  userDetail(token, username, onSuccess, onFailed)
}

_updateProfilePhoto = (image) =>{
    onSuccess = (res) =>{
      this.setState((prevState)=>{
        user = prevState.user;
        user.profile.avatar_url = res.avatar_url;
        return {user}
      })
    }
    onFailed = (error) =>{

    }
    updateProfilePhoto(this.state.token, image, onSuccess, onFailed)
}

 userPostsRequest = (token, username) => {
   const { page } = this.state;
   this.setState({ loading: true });
   next_page = user_posts + username + '/';
   if(page !== 1){
     next_page = this.state.next_page
   }
   let onSuccess = (res) =>{
     if (page === 1){
       this.props.initProfilePost(username, res.results)
     }else{
       this.props.loadMoreProfilePost(username, res.results)
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
   userPosts(token, next_page, username, onSuccess, onFailed)
 };

 _followUser = ()=>{
   let onSuccess = (res) =>{
     this.setState((prevState) =>{
       user = prevState.user
       user.you_follow = res.following
       return {user}
     })
   }
   let onFailed = (error) =>{
     Toast.show({
             text: 'خطایی بوجود آمد',
             position: 'bottom',
             duration : 3000,
             type: 'danger'
           })
   }
   followUser(this.state.token, this.state.username, onSuccess, onFailed)
 }

 openPostDetail = (profilePost) =>{
   this.props.navigation.navigate('PostDetailPage', {token: this.state.token, profilePost, user:this.state.user})
 }

 render(){
   return(
     <View style={{flex:1, backgroundColor:'#BDBDBD'}}>
     <Header style={{backgroundColor: '#F5F5F5'}}>
       <StatusBar
          backgroundColor="#e0e0e0"
          barStyle="dark-content"
        />
       <View style={{width: 40}}/>
       <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:1}}>
          {this.state.user &&
            <Title style={{ color: 'black', fontWeight:'bold'}}>{this.state.user.profile.full_name}</Title>
          }
       </View>
       <View style={{width: 40, justifyContent:'center'}}>
        {this.state.isItMe &&
          <Icon style={{padding: 5}} name='settings'/>
        }
       </View>

     </Header>
          {this.state.user &&
            <View style={styles.personInfoContainer}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'stretch'}}>
                    <View style={{flex:1,margin:1, justifyContent:'center', alignItems:'center'}}>
                      <Text textSize={15} fontWeight='bold' style={styles.countText}>{countText(this.state.user.follow.n_followers)}</Text>
                      <Text>مورد دیده شدن</Text>
                    </View>
                    <View style={{flex:1,margin:1, justifyContent:'center', alignItems:'center'}}>
                      <Text textSize={15} fontWeight='bold' style={styles.countText}>{countText(this.state.user.follow.n_followings)}</Text>
                      <Text>دیده کردن</Text>
                    </View>
                  </View>

                </View>
                <TouchableWithoutFeedback onPress={()=>{
                  ImagePicker.openPicker({
                    width: 300,
                    height: 300,
                    cropperCircleOverlay : true,
                    cropping: true
                  }).then(image => {
                    this._updateProfilePhoto(image)
                  }).catch(error => {});
                }}>
                  <Thumbnail large source={{uri: this.state.user.profile.avatar_url}}/>
                </TouchableWithoutFeedback>

              </View>
              <Text style={{fontSize: 12, padding:5}}>{this.state.user.bio}</Text>
              <View style={{flexDirection:'row'}}>
                {this.state.isItMe ?
                <Button style={{flex:1, margin:2}} onPress={()=>{}}>
                  <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} > موجودی {EnglishNumberToPersianPrice(this.state.user.money)} تومان</Text>
                  <Icon name='credit-card' color='#ffffff'/>
                </Button>
                :
                <View style={{flex:1, margin:2}}>
                  {this.state.user.you_follow ?
                    (
                      <Button success block onPress={this._followUser}>
                        <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} >دنبال میکنم</Text>
                        <Icon name='person' color='#ffffff'/>
                      </Button>
                    )
                    :
                    (
                      <Button block onPress={this._followUser}>
                        <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} >دنبال کن</Text>
                        <Icon name='person-add' color='#ffffff'/>
                      </Button>
                    )}

                </View>
               }
               <Button style={{margin:2, backgroundColor:'white'}} onPress={()=>{this.props.navigation.navigate('ReviewPage', {token: this.state.token, username: this.state.username})}}>
                 <Text style={{color:'gray'}}>
                  <Text>(</Text>
                  <Text>{EnglighNumberToPersian(this.state.user.profile.count_of_rates)}</Text>
                  <Text>)</Text>
                 </Text>
                 <Rating
                   imageSize={12}
                   readonly
                   startingValue={this.state.user.profile.score}
                   style = {{margin: 3}}
                   />
               </Button>
              </View>


              <View style={{flexDirection:'row'}}>
              {this.state.user.location &&
                <TouchableWithoutFeedback  onPress={()=>{}}>
                  <View style={styles.contactButton}>
                    <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} >آدرس</Text>
                    <Icon name='my-location' color='#ffffff'/>
                  </View>
                </TouchableWithoutFeedback>
              }
              {this.state.user.phone_number &&
                <TouchableWithoutFeedback  onPress={()=>{}}>
                  <View style={styles.contactButton}>
                    <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} >تماس</Text>
                    <Icon name='call' color='#ffffff'/>
                  </View>
                </TouchableWithoutFeedback> }
              </View>
            </View>
          }



          <FlatList
           data={this.props.data[this.state.username]}
           contentContainerStyle={styles.list}
           numColumns = {3}
           keyExtractor={item => item.uuid}
           refreshing = {this.state.refreshing}
           onRefresh={this.handleRefresh}
           onEndReached={this.handleLoadMore}
           onEndReachedThreshold={10}
           ListFooterComponent={this.renderFooter}
           renderItem={({item}) =>
              <TouchableWithoutFeedback onPress={()=>this.openPostDetail(item)}>

                  <Image style={{width:getPostWidth(), height:getPostWidth() , borderRadius:2 , margin: 2 }}
                  source={{uri: item.post.image_url_0}} />

              </TouchableWithoutFeedback>

           }/>

     </View>

   )
 }
}

function SettingOrFollowButton(props){
  let itIsMe = props.isItMe;
  let following = props.following;
  if (itIsMe) {
    return(
      <TouchableWithoutFeedback  onPress={()=>{}}>
        <View style={styles.settingButton}>
          <Text style={{color:'#ffffff'}} > تنظیمات</Text>
          <Icon name='settings' color='#ffffff'/>
        </View>
      </TouchableWithoutFeedback>
    );
  }else if (following) {
    return(
      <TouchableWithoutFeedback  onPress={()=>{}}>
        <View style={styles.followingButton}>
          <Text style={{color:'#ffffff'}} > دنبال میکنم</Text>
          <Icon name='person-outline' color='#ffffff'/>
        </View>
      </TouchableWithoutFeedback>
    );
  }else {
    return(
      <TouchableWithoutFeedback  onPress={()=>{}}>
        <View style={styles.followButton}>
          <Text style={{color:'#ffffff'}} > دنبال کن</Text>
          <Icon name='person-add' color='#ffffff'/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function getPostWidth(){
  let width= Dimensions.get('window').width;
  width -= 3 * 4
  return Math.floor(width / 3)

}

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
  },
  personInfoContainer: {
    flexDirection:'column',
    padding: 5,
    margin:3,
    backgroundColor:'#fff',
    borderRadius:2,
    borderColor:'#BDBDBD',
    borderWidth:0.5
  },
  settingButton:{
    backgroundColor:'#37474F',
    flexDirection:'row',
    margin: 2,
    padding:4,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  followingButton:{
    backgroundColor:'#009688',
    flexDirection:'row',
    margin: 2,
    padding:4,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  followButton:{
    backgroundColor:'#D32F2F',
    flexDirection:'row',
    margin: 2,
    padding:4,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  moneyButton:{
    backgroundColor:'#00897B',
    flexDirection:'row',
    margin: 1,
    padding:8,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  contactButton:{
    backgroundColor:'#455A64',
    flex:1,
    flexDirection:'row',
    margin: 1,
    padding:5,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  countText:{
    margin: 5,
    fontWeight: 'bold',
    fontSize:19,
  }
});


function mapStateToProps(state){
 return{
   data: state.profilePostReducer
 };
}
function matchDispatchToProps(dispatch){
 return bindActionCreators({initProfilePost, loadMoreProfilePost}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ProfilePage);
