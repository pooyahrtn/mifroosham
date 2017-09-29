import React, { Component } from 'react';
import {bought_transactions_url} from '../serverAddress.js';
import AbstractTransactionPage from './AbstractTransactionsPage.js'
import {initBoughtData, updateBoughtTransaction, loadBoughtMore, deleteBoughtTransaction} from '../actions/transactionsActions.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

 class Page extends Component{
  static navigationOptions = {
   tabBarLabel: 'خرید ها',

 };

  token = this.props.navigation.state.params.token
  render(){
    return (
      <AbstractTransactionPage
        type = 'BO'
        data = {this.props.data}
        initData = {this.props.initBoughtData}
        loadMore = {this.props.loadBoughtMore}
        updateTransaction = {this.props.updateBoughtTransaction}
        deleteTransaction = {this.deleteBoughtTransaction}
        transactions_url = {bought_transactions_url}
        lable = 'خرید ها'
        token = {this.token}
        null_transaction_message = 'هیچ خریدی وجود ندارد'
      />
    )
  }

}


function mapStateToProps(state){
  return{
    data : state.boughtTransactionsReducer
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({initBoughtData, loadBoughtMore, updateBoughtTransaction, deleteBoughtTransaction}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Page);
