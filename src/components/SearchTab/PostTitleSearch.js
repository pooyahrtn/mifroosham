import React, { Component } from 'react';
import {searchPostTitle} from '../../requestServer.js';
import AbstractSearchPage from './AbstractSearchPage.js'
import SmallPostItem from '../PostItem/smallPostItem.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text, Dimensions, TouchableWithoutFeedback} from 'react-native';
import {requestLocation} from '../../utility/locationUtility.js';
import SInfo from 'react-native-sensitive-info';

 class Page extends Component{
  static navigationOptions = {
   tabBarLabel: 'کالا',

 };

 token = undefined
 my_username = undefined
 current_location = undefined

 componentDidMount(){
   let onSuccess = (res) =>{
     this.current_location = res
   }
   let onFailed = (error) =>{
     alert(error.message)
   }
   requestLocation(navigator , onSuccess, onFailed)
   SInfo.getItem('username', {
   sharedPreferencesName: 'mifroosham',
   keychainService: 'mifroosham'}).then(my_username => {
       if (my_username != null){
         this.my_username = my_username
       } else{
         this.props.navigation.navigate('Authentication')
       }
     });
 }

  render(){
    return (
      <AbstractSearchPage
        search = {searchPostTitle}
        navigation = {this.props.navigation}
        renderItem = {_renderItem}
        searchText = 'نام کالا'
        numberOfColumns = {2}
        keyExtractor = {(item) => item.uuid}
        normalizeQuery = {(text)=> text.replace(/ /gi, "_")}
      />
    )
  }

}
function _renderItem(props){
  return(

    <SmallPostItem
      post = {props}
      width = {getPostWidth()}
      buyable = {props.sender.username !== this.my_username}
      token = {props.token}
      current_location = {props.current_location}
      openPostDetail = {props.openPostDetail}
    />


  )
}

function getPostWidth(){
  let width = Dimensions.get('window').width;
  width -= 2 * 4
  return Math.floor(width / 2)

}

function mapStateToProps(state){
  return{

  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Page);
