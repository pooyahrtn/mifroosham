import React, { Component } from 'react';
import {sold_transactions_url} from '../serverAddress.js';
import AbstractTransactionPage from './AbstractTransactionsPage.js'

export default class Page extends Component{
  static navigationOptions = {
   tabBarLabel: 'فروش ها',

 };

  token = this.props.navigation.state.params.token
  render(){
    return (
      <AbstractTransactionPage
        type = 'SO'
        transactions_url = {sold_transactions_url}
        lable = 'فروش ها'
        token = {this.token}
        null_transaction_message = 'هیچ فروشی وجود ندارد'
      />
    )
  }

}
