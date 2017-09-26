import React, { Component } from 'react';
import {bought_transactions_url} from '../serverAddress.js';
import AbstractTransactionPage from './AbstractTransactionsPage.js'

export default class Page extends Component{
  static navigationOptions = {
   tabBarLabel: 'خرید ها',

 };

  token = this.props.navigation.state.params.token
  render(){
    return (
      <AbstractTransactionPage
        type = 'BO'
        transactions_url = {bought_transactions_url}
        lable = 'خرید ها'
        token = {this.token}
        null_transaction_message = 'هیچ خریدی وجود ندارد'
      />
    )
  }

}
