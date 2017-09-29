import React, { Component } from 'react';
import {sold_transactions_url} from '../serverAddress.js';
import AbstractTransactionPage from './AbstractTransactionsPage.js'
import {initSoldData, updateSoldTransaction, loadSoldMore, deleteSoldTransaction} from '../actions/transactionsActions.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class Page extends Component{
  static navigationOptions = {
   tabBarLabel: 'فروش ها',

 };

  token = this.props.navigation.state.params.token
  render(){
    return (
      <AbstractTransactionPage
        type = 'SO'
        transactions_url = {sold_transactions_url}
        initData = {this.props.initSoldData}
        loadMore = {this.props.loadSoldMore}
        deleteTransaction = {this.props.deleteSoldTransaction}
        data = {this.props.soldData}
        updateTransaction = {this.props.updateSoldTransaction}
        lable = 'فروش ها'
        token = {this.token}
        null_transaction_message = 'هیچ فروشی وجود ندارد'
      />
    )
  }

}


function mapStateToProps(state){
  return{
    soldData : state.soldTransactionsReducer
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({initSoldData, loadSoldMore, updateSoldTransaction, deleteSoldTransaction}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Page);
