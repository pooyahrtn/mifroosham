import React, { Component } from 'react';
import {connect} from 'react-redux';
import {FlatList, StyleSheet, Dimensions, Image, View, Text,TouchableWithoutFeedback, Linking} from 'react-native';
import {bindActionCreators} from 'redux';
import { Card ,  Thumbnail} from 'native-base';
import {getUserThunk} from '../actions/index';
import { Icon } from 'react-native-elements';
import {countText, EnglishNumberToPersianPrice} from '../utility/NumberUtils.js';
import {phonecall} from 'react-native-communications'
import ImagePicker from 'react-native-image-crop-picker';


class ProfilePage extends Component {
 componentDidMount(){
   this.props.getUserThunk(this.props.activeUser);
 }
 constructor(props){
   super(props);
 }



 render(){
   return(
     <View>
      {this.props.userInfo &&
        <View style={styles.personInfoContainer}>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'stretch'}}>
                <View style={{flex:1,margin:1, justifyContent:'center', alignItems:'center'}}>
                  <Text textSize={15} fontWeight='bold' style={styles.countText}>{countText(this.props.userInfo.followers_count)}</Text>
                  <Text>مورد دیده شدن</Text>
                </View>
                <View style={{flex:1,margin:1, justifyContent:'center', alignItems:'center'}}>
                  <Text textSize={15} fontWeight='bold' style={styles.countText}>{countText(this.props.userInfo.followings_count)}</Text>
                  <Text>دیده کردن</Text>
                </View>
              </View>
              <SettingOrFollowButton following={this.props.userInfo.following} itIsMe={this.props.userInfo.itIsMe}/>
            </View>
            <TouchableWithoutFeedback onPress={()=>{
              ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropperCircleOverlay : true,
                cropping: true
              }).then(image => {
                
              });
            }}>
              <View style={{flex:1, alignItems:"flex-end"}}>
                <Thumbnail large source={{uri: this.props.userInfo.avatar_url}}/>
                <Text style={{padding:5, fontWeight:'bold', flex:1}}>{this.props.userInfo.full_name}</Text>
              </View>
            </TouchableWithoutFeedback>

          </View>
          <Text style={{fontSize: 12, padding:5}}>{this.props.userInfo.bio}</Text>
          {this.props.userInfo.itIsMe &&
            <TouchableWithoutFeedback  onPress={()=>{}}>
            <View style={styles.moneyButton}>
              <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} > موجودی {EnglishNumberToPersianPrice(this.props.userInfo.money)} تومان</Text>
              <Icon name='credit-card' color='#ffffff'/>
            </View>
          </TouchableWithoutFeedback>}

          <View style={{flexDirection:'row'}}>
          {this.props.userInfo.location &&
            <TouchableWithoutFeedback  onPress={()=>{Linking.openURL(this.props.userInfo.location).catch(err => console.error('An error occurred', err));}}>
              <View style={styles.contactButton}>
                <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} >آدرس</Text>
                <Icon name='my-location' color='#ffffff'/>
              </View>
            </TouchableWithoutFeedback>
          }
          {this.props.userInfo.phone_number &&
            <TouchableWithoutFeedback  onPress={()=>{phonecall(this.props.userInfo.phone_number, true)}}>
              <View style={styles.contactButton}>
                <Text style={{color:'#ffffff', fontWeight:'bold', fontSize:15}} >تماس</Text>
                <Icon name='call' color='#ffffff'/>
              </View>
            </TouchableWithoutFeedback> }
          </View>
        </View>
      }
      {(this.props.userInfo && this.props.userInfo.posts.length > 0)&&
        <FlatList
         data={this.props.userInfo.posts}
         contentContainerStyle={styles.list}
         numColumns = {3}
         keyExtractor={item => item.id}
         renderItem={({item}) =>

             <Image style={{width:getPostWidth(), height:getPostWidth() , borderRadius:2 , margin: 2, borderColor:'#E0E0E0', borderWidth:1}} source={{uri: item.image_url}}/>

         }/>
      }
     </View>
   )
 }
}

function SettingOrFollowButton(props){
  let itIsMe = props.itIsMe;
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
   activeUser : state.activeUser,
   userInfo : state.userInfo
 };
}
function matchDispatchToProps(dispatch){
 return bindActionCreators({getUserThunk: getUserThunk}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ProfilePage);
