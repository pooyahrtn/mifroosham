// props: token, transactions_url, lable, type, null_transaction_message
import React, { Component } from 'react';
import {View, FlatList, StatusBar, ActivityIndicator, Text, Modal, TextInput, TouchableWithoutFeedback} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button ,Content, Header, Body, Title, List, Toast} from 'native-base';
import {delete_transaction_url, write_review_url, confirm_deliver_url, transaction_helps_url, cancel_sell_url, get_phone_number_from_transaction} from '../serverAddress.js';
import DeliverItem from './deliverItem.js'
import StarRating from 'react-native-star-rating';
import {phonecall} from 'react-native-communications';
import {readNotifications} from '../requestServer.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class AbstractTransactionPage extends Component {

  token = this.props.token;

  componentDidMount(){
    this.makeRemoteRequest(this.token)
    readNotifications(this.token, (res)=>{this.props.readNotifications()}, (err)=>{})
    this.loadHelps()
  }
  constructor(props){
    super(props);
    this.state = {

      loading: false,
      next_page : this.props.transactions_url,
      error : null,
      refreshing : false,
      page :1,
      selected_transaction_to_review : undefined,
      show_review_modal: false,
      show_review_for_edit : false,
      show_deliver_modal : false,
      selected_transaction_to_deliver : undefined,
      selected_transaction_to_deliver_confirm_code : undefined,
      deliver_item_error_massage : ' ',
      loading_confirm_deliver : false,
      helps : undefined,
      show_cancel_sell: false,
      selected_transaction_to_cancel : undefined,
      selected_transaction_to_cancel_disable_after_cancel : false,

    }
  }

  loadHelps = ()=>{
    fetch(transaction_helps_url).then(res=>res.json()).then(
      resjes => {this.setState({helps: resjes})}
    ).catch(error=>{
      this.loadHelps()
    })
  }

  makeRemoteRequest = (token) => {
    const { page } = this.state;
    this.setState({ loading: true });
    next_url = ''
    if (page === 1) {
      next_url = this.props.transactions_url
    }else{
      next_url = this.state.next_page
    }

    fetch(next_url,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        }
      }
    )
      .then(res => res.json())
      .then(res => {
        if (page === 1){
          this.props.initData(res.results)
        }else{
          this.props.loadMore(res.results)
        }
        this.setState({
          error: res.error || null,
          loading: false,
          refreshing: false,
          next_page : res.next,
          top_loading : false,
          show_review_modal: false,
          selected_transaction_to_review_rate : 5,
          selected_transaction_to_review_comment : '',

        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
      });
  };

  handleRefresh = () => {
     this.setState(
       {
         page: 1,
         refreshing: true
       },
       () => {
        this.makeRemoteRequest(this.token)
       }
     );
   };

  handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          setTimeout(()=>this.makeRemoteRequest(this.token), 5000)
        }
      );
  };

  renderFooter = () => {
      if (!this.state.loading) return null;
      return (

        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

  renderListEmpty = ()=>{
    if(!this.state.loading){
      return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <View style={{borderColor:'#FFCDD2', borderWidth:2, borderRadius: 3, justifyContent:'center', alignItems:'center', padding:20, margin: 40}}>
            <Icon name='sentiment-dissatisfied' size={45}/>
            <Text style={{margin:5, fontWeight:'bold'}}>{this.props.null_transaction_message}</Text>
          </View>
        </View>

      )
    }else {
      return (<View/>)
    }

  }

  deleteItem = (transaction) =>{
    this.setState({top_loading : true})
    fetch(delete_transaction_url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.token
        }, body : JSON.stringify(
          {
            transaction_uuid : transaction.uuid
          }
        )
      }
    )
      .then( res =>{
          this.setState({top_loading: false})
          if(res.status === 200){
            index = this.state.data.findIndex((item) => item.uuid === transaction.uuid);
            data = this.state.data
            data.splice(index,1)
            this.setState({data})
          }
        }
      )
      .catch(error => {
        this.setState({ error });
        Toast.show({
                text: 'خطایی بوجود آمد',
                position: 'bottom',
                duration : 3000,
                type: 'danger'
              })
      });
  }

  reviewTransaction(transaction, rate, comment){
    if(this.props.type === 'SO'){
      this.setState({show_review_modal : false})
      return
    }
    fetch(write_review_url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.token
        }, body : JSON.stringify(
          {
            transaction_uuid : transaction.uuid,
            rate: rate,
            comment: comment
          }
        )
      }
    )
      .then( res =>{

          if(res.status === 200){
            return res.json();
          }else{

            this.setState({show_review_modal : false, data}, ()=>{
              Toast.show({
                      text: 'مشکلی پیش آمد',
                      position: 'bottom',
                      duration : 3000,
                      type: 'danger'
                    })
            })
          }
        }
      ).then(
        resjes => {
          // this.setState((state) => {
          //   // copy the map rather than modifying state.
          //   const data = state.data;
          //   index = data.findIndex((item)=> {return item.uuid === resjes.transaction_uuid})
          //   trans = data[index]
          //   trans.rate_status = 'ra'
          //   trans.review = {
          //     rate, comment
          //   }
          //   data[index] = trans
          //   return {data, show_review_modal: false};
          // }, ()=>{
          //     Toast.show({
          //             text: 'نظر شما ثبت شد',
          //             position: 'bottom',
          //             duration : 3000,
          //             type: 'success'
          //           })
          // });
          this.props.updateTransaction(resjes)
          this.setState({show_review_modal: false}, ()=>{
            Toast.show({
                        text: 'نظر شما ثبت شد',
                        position: 'bottom',
                        duration : 3000,
                        type: 'success'
                      })
          })

        }
      )
      .catch(error => {
        console.error(error);
        this.setState({ error, show_review_modal: false }, ()=>{
          Toast.show({
                  text: 'خطایی بوجود آمد',
                  position: 'bottom',
                  duration : 3000,
                  type: 'danger'
                })
        });

      });
  }

  confirmDeliver(transaction, confirm_code){
    this.setState({loading_confirm_deliver : true})
    fetch(confirm_deliver_url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.token
        }, body : JSON.stringify(
          {
            transaction_uuid : transaction.uuid,
            confirm_code: confirm_code
          }
        )
      }
    )
      .then( res =>{

          if(res.status === 200){
            return {json: res.json(),ok: true}
          }else if(res.status === 420){
            this.setState({deliver_item_error_massage: 'کد تحویل اشتباه است', loading_confirm_deliver:false})
            return {ok: false}
          }else {
            this.setState({ loading_confirm_deliver:false, show_deliver_modal: false}, ()=>{
              Toast.show({
                      text: 'خطایی بوجود آمد',
                      position: 'bottom',
                      duration : 3000,
                      type: 'danger'
                    })
              return {ok: false}
            })
          }
        }
      ).then((resjes) =>{
        if(resjes.ok){
          this.setState((state) => {
            // copy the map rather than modifying state.
            const data = state.data;
            index = data.findIndex((item)=> {return item.uuid === transaction.uuid})
            trans = data[index]
            trans.status = 'de'
            trans.deliver_time = new Date()
            trans.rate_status = 'cr'
            data[index] = trans
            return {data, show_deliver_modal: false};
          }, ()=>{
            Toast.show({
                    text: 'آگهی تحویل داده شد',
                    position: 'bottom',
                    duration : 3000,
                    type: 'success'
                  })
          });
        }

      })

      .catch(error => {
        this.setState({ error, show_deliver_modal: false }, ()=>{
          Toast.show({
                  text: 'خطایی بوجود آمد',
                  position: 'bottom',
                  duration : 3000,
                  type: 'danger'
                })
        });

      });
  }

  showCancelSellModal = (transaction) =>{
    this.setState({selected_transaction_to_cancel: transaction, show_cancel_sell: true})
  }

  showReviewModal = (transaction)=>{
    if(transaction.rate_status === 'ra'){
      this.setState({show_review_modal: true, selected_transaction_to_review : transaction,
         selected_transaction_to_review_rate : transaction.review.rate, selected_transaction_to_review_comment : transaction.review.comment})
    }else{
      this.setState({show_review_modal: true, selected_transaction_to_review : transaction,
         selected_transaction_to_review_rate : 5, selected_transaction_to_review_comment : null})
    }
  }

  showDeliverModal = (transaction)=>{
    this.setState({show_deliver_modal : true, selected_transaction_to_deliver : transaction, deliver_item_error_massage: ' ', loading_confirm_deliver: false})
  }

  cancelSell = (transaction, disable_post) =>{
    this.setState({loading_confirm_deliver : true})
    fetch(cancel_sell_url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.token
        }, body : JSON.stringify(
          {
            transaction_uuid : transaction.uuid,
            disable_post : disable_post
          }
        )
      }
    )
      .then( res =>{

          if(res.status === 200){
            return {json: res.json(),ok: true}
          }else {
            this.setState({ loading_confirm_deliver:false, show_deliver_modal: false}, ()=>{
              Toast.show({
                      text: 'خطایی بوجود آمد',
                      position: 'bottom',
                      duration : 3000,
                      type: 'danger'
                    })
              return {ok: false}
            })
          }
        }
      ).then((resjes) =>{
        if(resjes.ok){
          this.setState((state) => {
            // copy the map rather than modifying state.
            const data = state.data;
            index = data.findIndex((item)=> {return item.uuid === transaction.uuid})
            trans = data[index]
            trans.status = 'ca'
            trans.cancel_time = new Date()

            data[index] = trans
            return {data, show_cancel_sell: false};
          }, ()=>{
            Toast.show({
                    text: 'فروش لغو شد',
                    position: 'bottom',
                    duration : 3000,
                    type: 'success'
                  })
          });
        }

      })
      .catch(error => {
        this.setState({ error, show_deliver_modal: false }, ()=>{
          Toast.show({
                  text: 'خطایی بوجود آمد',
                  position: 'bottom',
                  duration : 3000,
                  type: 'danger'
                })
        });

      });
  }

  makePhoneCall = (transaction)=>{
    fetch(get_phone_number_from_transaction,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.token
        }, body : JSON.stringify(
          {
            transaction_uuid : transaction.uuid,
          }
        )
      }
    )
      .then( res =>{

          if(res.status === 200){
            return res.json()
          }else {
            this.setState({ loading_confirm_deliver:false, show_deliver_modal: false}, ()=>{
              Toast.show({
                      text: 'خطایی بوجود آمد',
                      position: 'bottom',
                      duration : 3000,
                      type: 'danger'
                    })
              return {ok: false}
            })
          }
        }
      ).then((resjes) =>{
        if(resjes){
          // console.log(resjes.phone_number);
          phonecall(resjes.phone_number, true)
        }

      })
      .catch(error => {
        // console.log(error);
        this.setState({ error, show_deliver_modal: false }, ()=>{
          Toast.show({
                  text: 'خطایی بوجود آمد',
                  position: 'bottom',
                  duration : 3000,
                  type: 'danger'
                })
        });

      });
  }

  auctionSuggestHigher = (transaction)=>{
    this.props.navigation.navigate('BuyItemPage', {post: transaction.post, token: this.token, reposter: transaction.reposter})
  }
// reviews={["خیلی بد", "بد", "ای...", "خوب", "عالی",]}
  render(){

    return(
      <Container>
        <StatusBar
           backgroundColor="#e0e0e0"
           barStyle="dark-content"
         />
         <Modal
           transparent={true}
           visible={this.state.show_review_modal}
           onRequestClose={() => {this.setState({show_review_modal: !this.state.show_review_modal})}}
           animationType="fade"
           >
           <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
             <View style={{margin: 22, backgroundColor:'#ffffff', borderRadius: 3}}>
                <View style={{padding: 10}}>
                  <StarRating
                    selectedStar={(rate)=>{this.setState({selected_transaction_to_review_rate: rate})}}
                    rating={this.state.selected_transaction_to_review_rate}
                    maxStars={5}
                    disabled = {this.props.type === 'SO'}
                    />
                </View>

                 <TextInput editable={this.props.type === 'BO'} style={{borderRadius: 2, borderWidth: 1, borderColor: '#e0e0e0', textAlign:'center', margin: 10}} placeholder='نظر شما' value={this.state.selected_transaction_to_review_comment}
                  multiline={true} numberOfLines = {4} onChangeText={(text)=>{this.setState({selected_transaction_to_review_comment: text})}} />
                 <View style={{flexDirection:'row'}}>
                   {this.props.type === 'BO' &&
                     <Button danger block onPress={()=>this.setState({show_review_modal: !this.state.show_review_modal})} style={{margin: 4, flex:1}}>
                       <Text style={{color:'#ffffff', margin: 2}}>بیخیال</Text>
                     </Button>
                   }

                   <Button success block onPress={()=>this.reviewTransaction(this.state.selected_transaction_to_review,
                      this.state.selected_transaction_to_review_rate, this.state.selected_transaction_to_review_comment)} style={{margin: 4, flex:1}}>
                     <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                   </Button>
                 </View>
             </View>
           </View>
         </Modal>

        {this.props.type === 'SO' &&
          <Modal
            transparent={true}
            visible={this.state.show_deliver_modal}
            onRequestClose={() => {this.setState({show_deliver_modal: !this.state.show_deliver_modal})}}
            animationType="fade"
            >
            <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
              <View style={{margin: 22, backgroundColor:'#ffffff', borderRadius: 3, padding: 5}}>
                <Text style={{padding: 5, textAlign:'center', fontSize: 17, fontWeight:'bold', color:'green'}}>تحویل آگهی</Text>
                <Text style={{textAlign: 'center', padding: 3}}>لطفا هنگام تحویل گالا، کد تحویل را گرفته و وارد کنید، تا مبلغ آگهی به حساب شما وارد شود.</Text>

               <TextInput keyboardType='numeric' style={{borderRadius: 2, borderWidth: 1, borderColor: '#e0e0e0', textAlign:'center', margin: 10}} placeholder='کد تحویل'
                 onChangeText={(text)=>{this.setState({selected_transaction_to_deliver_confirm_code: text})}} />
                <Text style={{fontWeight:'bold', padding: 5, color:'red'}}>{this.state.deliver_item_error_massage}</Text>
               <View style={{flexDirection:'row'}}>

                 <Button danger block onPress={()=>this.setState({show_deliver_modal: false})} style={{margin: 4, flex:1}}>
                   <Text style={{color:'#ffffff', margin: 2}}>بیخیال</Text>
                 </Button>
                 {this.state.loading_confirm_deliver ? (
                   <Button success block onPress={()=>{}} style={{margin: 4, flex:1}}>
                     <Text style={{color:'#ffffff', margin: 2}}>لطفا صبر کنید</Text>
                   </Button>
                 ):(
                   <Button success block onPress={()=>{this.confirmDeliver(this.state.selected_transaction_to_deliver, this.state.selected_transaction_to_deliver_confirm_code)}} style={{margin: 4, flex:1}}>
                     <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                   </Button>
                 )}

               </View>
              </View>

            </View>
          </Modal>
        }
        {this.props.type === 'SO' &&
          <Modal
            transparent={true}
            visible={this.state.show_cancel_sell}
            onRequestClose={() => {this.setState({show_cancel_sell: !this.state.show_cancel_sell})}}
            animationType="fade"
            >
            <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
              <View style={{margin: 22, backgroundColor:'#ffffff', borderRadius: 3, padding: 5}}>
                <Text style={{padding: 5, textAlign:'center', fontSize: 17, fontWeight:'bold', color:'red'}}>لغو فروش</Text>
                <Text style={{textAlign: 'center', padding: 3}}>آیا تمایل به لغو فروش به این کاربر را دارید؟</Text>
                <Text style={{textAlign: 'center', padding: 3}}>در صورت لغو، مبلغ تراکنش به خریدار بازخواهد گشت.</Text>
                {this.state.selected_transaction_to_cancel && this.state.selected_transaction_to_cancel.post.post_type === 2 &&
                  <Text style={{textAlign: 'center', padding: 3, color:'red'}}>{this.state.helps.cancel_sell_auction_alert}</Text>
                }
                <TouchableWithoutFeedback onPress={()=>{this.setState({selected_transaction_to_cancel_disable_after_cancel: !this.state.selected_transaction_to_cancel_disable_after_cancel})}}>
                  <View style={{flexDirection:'row',alignItems:'center', padding: 10, margin: 5}}>

                    <Text style={{flex:1, margin: 3}}>حذف آگهی</Text>
                    {this.state.selected_transaction_to_cancel_disable_after_cancel?(
                      <Icon color='#33691E' name='check-box' size={25} />
                    ):(
                      <Icon name='check-box-outline-blank'size={25}/>
                    )}
                  </View>
                </TouchableWithoutFeedback>
               <View style={{flexDirection:'row'}}>

                 <Button danger block onPress={()=>this.setState({show_cancel_sell: false})} style={{margin: 4, flex:1}}>
                   <Text style={{color:'#ffffff', margin: 2}}>بیخیال</Text>
                 </Button>
                 {this.state.loading_confirm_deliver ? (
                   <Button success block onPress={()=>{}} style={{margin: 4, flex:1}}>
                     <Text style={{color:'#ffffff', margin: 2}}>لطفا صبر کنید</Text>
                   </Button>
                 ):(
                   <Button success block onPress={()=>{this.cancelSell(this.state.selected_transaction_to_cancel, this.state.selected_transaction_to_cancel_disable_after_cancel)}} style={{margin: 4, flex:1}}>
                     <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                   </Button>
                 )}

               </View>
              </View>

            </View>
          </Modal>
        }

        <View style={{flex:1}}>
          <FlatList data={this.props.data}
            keyExtractor={item => item.uuid}
            refreshing = {this.state.refreshing}
            onRefresh={()=>this.handleRefresh()}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={4}
            initialNumToRender={10}
            extraData={this.state}
            ListEmptyComponent = {this.renderListEmpty}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
              <DeliverItem
                {...item}
                type = {this.props.type}
                deleteItem = {this.deleteItem}
                showReviewModal = {this.showReviewModal}
                showDeliverModal = {this.showDeliverModal}
                showCancelSellModal = {this.showCancelSellModal}
                auctionSuggestHigher = {this.auctionSuggestHigher}
                makePhoneCall = {this.makePhoneCall}
              />
            }/>
        </View>

      </Container>
    )
  }
}


function mapStateToProps(state){
  return{

  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({readNotifications}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(AbstractTransactionPage);
