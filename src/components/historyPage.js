import React, { Component } from 'react';
import {connect} from 'react-redux';
import {FlatList} from 'react-native';
import {bindActionCreators} from 'redux';
import HistoryItem from './historyItem.js'
import {getRecentHistoryThunk} from '../actions/index';

class HistoryPage extends Component {
 componentDidMount(){
   this.props.getRecentHistoryThunk();
 }
 constructor(props){
   super(props);
 }
 render(){

   return(
     <FlatList data={this.props.recentHistory}
         keyExtractor={item => item.id}
         renderItem={({item}) =>
           <HistoryItem
              {...item}
           />
         }/>
   )
 }
}

function mapStateToProps(state){
 return{
   recentHistory : state.recentHistory
 };
}
function matchDispatchToProps(dispatch){
 return bindActionCreators({getRecentHistoryThunk: getRecentHistoryThunk}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(HistoryPage);
