import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList} from 'react-native';
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PostItem from './postItem.js';
import {sampleData} from './sampleData.js';




export default class Main extends Component{

  constructor(props){
    super(props);
    this.state = {sampleFeed:null};
  }

  componentDidMount(){
    this.setState({sampleFeed : sampleData})
  }

  openProfilePage(user_id){
    this.props.userSelected(user_id);
  }

  render(){
    return(

      <FlatList data={this.state.sampleFeed}
        keyExtractor={item => item.id}
        refreshing = {false}
        onRefresh={()=>{}}
        renderItem={({item}) =>
          <PostItem
            {...item}
            openProfilePage = {this.props.openProfilePage}
          />

        }/>

    )
  }
}
