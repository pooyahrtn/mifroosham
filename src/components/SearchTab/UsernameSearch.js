import React, { Component } from 'react';
import {searchUsername} from '../../requestServer.js';
import AbstractSearchPage from './AbstractSearchPage.js'
import {Thumbnail} from 'native-base'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text, View, TouchableWithoutFeedback} from 'react-native';


 class Page extends Component{
  static navigationOptions = {
   tabBarLabel: 'اشخاص',

 };

 openProfilePage = (username) =>{
  this.props.navigation.navigate('OtherProfilePage', {username})
 }

  render(){
    return (
      <AbstractSearchPage
        search = {searchUsername}
        navigation = {this.props.navigation}
        renderItem = {_renderItem}
        keyExtractor = {(item) => item.username}
        searchText = 'نام کاربری'
        numberOfColumns = {1}
        openProfilePage = {this.openProfilePage}
        normalizeQuery = {(text) => text}
      />
    )
  }

}
function _renderItem(props){
  return(
    <TouchableWithoutFeedback onPress={()=>{props.openProfilePage(props.username)}}>
      <View style={{flexDirection:'row', padding: 5, alignItems:'center', backgroundColor:'white',
      borderRadius:2, margin: 3}}>
        <View style={{flex:1, padding: 5}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{flex:1}}> @{props.username}</Text>
            <Text style={{fontWeight:'bold'}}>{props.profile.full_name}</Text>
          </View>
          <Text>{props.profile.bio}</Text>
        </View>
        <Thumbnail small source={{uri: props.profile.avatar_url}}/>
      </View>
    </TouchableWithoutFeedback>
  )
}

function mapStateToProps(state){
  return{

  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Page);
