import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList, ActivityIndicator,
  AsyncStorage, Alert, PermissionsAndroid, Text, TextInput, TouchableWithoutFeedback, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js'
import {invest_helps_url, request_invest_url} from '../serverAddress.js';
import {updatePost as requestUpdatePost } from '../requestServer.js';
import {Toast} from 'native-base';
export default class InvestComponent extends Component{

  constructor(props){
    super(props);
    this.state = {
      invest_loading: false,
      requested_invest_qeroons : 0,
      request_invest_loading : false,
      requested_invest_qeroons_is_zero: false,
      remaining_qeroons_are_less_than_request : false,
      invest_helps : undefined,
      error: undefined,
    }
  }

  componentDidMount(){
    fetch(invest_helps_url,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.props.token
        }
      }
    ).then(res => res.json())
    .then(
      resjes =>{
        this.setState({
          invest_helps: resjes,
          invest_loading: false,
        })
        this.props.loadingTopCompeleted()
      }
    ).catch(error =>
      this.setState({error: error})
    )
  }

  requestInvestOnPost =(post, qeroons) =>{
    if(qeroons === 0){
      this.setState({requested_invest_qeroons_is_zero: true})
      return
    }
    if(this.state.request_invest_loading){
      return
    }
    this.setState({request_invest_loading:true})
    fetch(request_invest_url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.props.token
        }, body : JSON.stringify(
          {
            post_uuid: post.uuid,
            value : qeroons
          }
        )
      }
    ).then(res => {
      if(res.status === 200){
        this.setState({request_invest_loading: false})
        Toast.show({
                text: 'سرمایه گذاری شد.',
                position: 'bottom',
                duration : 3000,
                type: 'success'
              })
        this.props.hideInvestModal()
        this.refreshSelectedPostToInvest(this.props.selected_item_to_invest)
      }else if(res.status === 403){
        this.setState({request_invest_loading: false})
        this.props.hideInvestModal()
        Toast.show({
                text: 'این پست خریده یا غیر فعال شده است.',
                position: 'bottom',
                duration : 3000,
                type: 'danger'
              })
      }else if(res.status === 410){
        this.refreshSelectedPostToInvest(post)
        this.setState({remaining_qeroons_are_less_than_request : true})
      }else if (res.status === 400) {
        this.setState({request_invest_loading: false})
        this.props.hideInvestModal()
        Toast.show({
                text: 'خطایی بوجود آمد. لطفا مجددا تلاش کنید.',
                position: 'bottom',
                duration : 3000,
                type: 'danger'
              })
      }
    })
  .catch(error =>
      this.setState({error: error})
    )
  }

  refreshSelectedPostToInvest = (post)=>{
    this.setState({refreshin_selected_post_to_invest: true})
    onSuccess = (res) =>{
      this.setState({selected_item_to_invest: res, refreshin_selected_post_to_invest: false})
      this.props.updatePost(res)
    }
    onError = (error) =>{
      this.setState({refreshin_selected_post_to_invest: false})
      console.error(error)
      Toast.show({
              text: 'خطایی بوجود آمد',
              position: 'bottom',
              duration : 3000,
              type: 'danger'
            })
    }
    requestUpdatePost(this.props.token, post.uuid, onSuccess, onError)

  }

  render(){
    return(
      <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
        {this.state.invest_helps &&
          <View style={{borderRadius: 2, backgroundColor:'white', padding:5, margin: 5}}>
            <Text style={{textAlign:'center', color:'green', fontWeight:'bold', padding: 5, margin:5}}>سرمایه گذاری</Text>
            <Text style={{borderRadius:2,backgroundColor:'#e0e0e0',padding: 7, textAlign:'center', margin:3}}>
              <Text>قرون های شما: </Text>
              <Text>{EnglighNumberToPersian(this.state.invest_helps.your_qeroons)}</Text>
              <Text> قرون</Text>
            </Text>
            <View style={{borderRadius:2, backgroundColor:'#e0e0e0',padding: 7,  margin:3, flexDirection:'row', alignItems:'center'}}>
              {this.state.refreshin_selected_post_to_invest ?
                <ActivityIndicator/>
                :
                <Icon name='refresh' onPress = {()=> this.refreshSelectedPostToInvest(this.props.selected_item_to_invest)}/>
              }
              {this.props.selected_item_to_invest.remaining_qeroons > 0 ?
                (  <Text style={{flex:1 ,textAlign:'center',}} >
                    <Text>قرون های باقی مانده ی این پست: </Text>
                    <Text>{EnglighNumberToPersian(this.props.selected_item_to_invest.remaining_qeroons)}</Text>
                    <Text> قرون</Text>
                  </Text>)
                :
                (  <Text style={{flex:1 ,textAlign:'center',color:'red'}} >
                    <Text>از این پست قرونی باقی نمانده</Text>
                  </Text>
                )
              }

            </View>
            <View style={{borderRadius:2, backgroundColor:'#e0e0e0',padding: 7,  margin:3, flexDirection:'row', alignItems:'center'}}>
              {this.state.refreshin_selected_post_to_invest ?
                <ActivityIndicator/>
                :
                <Icon name='refresh' onPress = {()=> this.refreshSelectedPostToInvest(this.props.selected_item_to_invest)}/>
              }

              <Text style={{flex:1 ,textAlign:'center',}} >
                <Text>قرون های سرمایه گذاری شده روی پست:‌</Text>
                <Text>{EnglighNumberToPersian(this.props.selected_item_to_invest.total_invested_qeroons)}</Text>
                <Text> قرون</Text>
              </Text>
            </View>
            {this.props.selected_item_to_invest.remaining_qeroons !== 0 &&
              <View style={{alignItems:'center', padding: 7,margin:3, borderRadius:2, borderWidth:1, borderColor:'#e0e0e0'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text>قرون</Text>
                <TextInput onChangeText={(text)=>{this.setState({requested_invest_qeroons: text, requested_invest_qeroons_is_zero:false})}}
                  keyboardType='numeric' placeholder='مقدار سرمایه گذاری' style={{flex:1, textAlign:'center'}}/>
                </View>
                {this.state.requested_invest_qeroons > 0 &&
                  <Text style={{fontSize:12}}>
                    <Text>سودی که با فروش این پست بدست می آورید: </Text>
                    <Text style={{color:'green'}}>{EnglighNumberToPersian(this.state.invest_helps.qeroon_value * this.state.requested_invest_qeroons)}</Text>
                    <Text> تومان</Text>
                  </Text>
                }

                {parseInt(this.state.requested_invest_qeroons) > this.state.invest_helps.your_qeroons &&
                  <Text style={{color:'red', fontSize:12}}>این مقدار بیشتر از قرون های شماست.</Text>
                }
                {parseInt(this.state.requested_invest_qeroons) > this.props.selected_item_to_invest.remaining_qeroons &&
                  <Text style={{color:'red', fontSize:12}}>این مقداری بیشتر از قرون های باقی مانده از پست است.</Text>
                }
                {this.state.requested_invest_qeroons_is_zero &&
                  <Text style={{color:'red', fontSize:12}}>مقدار سرمایه گذاری نمیتواند صفر باشد.</Text>
                }
                {this.state.remaining_qeroons_are_less_than_request &&
                  <Text style={{color:'red', fontSize:12}}>این مقداری بیشتر از قرون های باقی مانده از پست است.</Text>
                }
              </View>
            }

            <View style={{flexDirection:'row', padding:1}}>
              <TouchableWithoutFeedback onPress={this.props.hideInvestModal}>
                <View style={{flex:1, alignItems:'center', justifyContent:'center', height:35 ,borderColor:'red',margin:2 ,borderWidth:1 ,borderRadius:2}}>
                  <Text style={{color: 'red'}}>بیخیال</Text>
                </View>
              </TouchableWithoutFeedback>
              {this.props.selected_item_to_invest.remaining_qeroons > 0 &&
                <TouchableWithoutFeedback onPress={()=> this.requestInvestOnPost(this.props.selected_item_to_invest, this.state.requested_invest_qeroons)}>
                  <View style={{flex:1, alignItems:'center', justifyContent:'center', height:35 ,backgroundColor:'green', margin:2 ,borderRadius:2}}>
                    {this.state.request_invest_loading ?
                      (
                        <Text style={{color:'white'}}>لطفا صبر کنید</Text>
                      ) :
                      (
                        <Text style={{color:'white'}}>خب</Text>
                      )}

                  </View>
                </TouchableWithoutFeedback>
              }

            </View>

          </View>
        }

      </View>
    )
  }

}
