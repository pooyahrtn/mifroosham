import React, { Component } from 'react';
import {View, FlatList, StatusBar, ActivityIndicator, Text, Modal} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button ,Content, Header, Body, Title, List, Toast} from 'native-base';
import {sold_transactions_url, delete_transaction_url, write_review_url} from '../serverAddress.js';
import DeliverItem from './deliverItem.js'
// import {getPendingNotifications, getPendingNotificationsThunk} from '../actions/index';

 export default class SoldPage extends Component {
   static navigationOptions = {
    tabBarLabel: 'فروش ها',

  };
  token = this.props.navigation.state.params.token;

  componentDidMount(){
    this.makeRemoteRequest(this.token)
  }
  constructor(props){
    super(props);
    this.state = {
      data: null,
      loading: false,
      next_page : sold_transactions_url,
      error : null,
      refreshing : false,
      page :1,
      show_review_modal: false,
    }
  }

  makeRemoteRequest = (token) => {
    const { page } = this.state;
    this.setState({ loading: true });
    next_url = ''
    if (page === 1) {
      next_url = sold_transactions_url
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
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false,
          next_page : res.next,
          top_loading : false,
          show_review_modal: false,
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
    return(
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <View style={{borderColor:'#FFCDD2', borderWidth:2, borderRadius: 3, justifyContent:'center', alignItems:'center', padding:20, margin: 40}}>
          <Icon name='sentiment-dissatisfied' size={45}/>
          <Text style={{margin:5, fontWeight:'bold'}}>کالای فروخته شده ای وجود ندارد</Text>
        </View>
      </View>

    )
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

  reviewTransaction(transaction){
    fetch(write_review_url,
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
            this.setState({show_review_modal : false}, ()=>{
              Toast.show({
                      text: 'نظر شما ثبت شد',
                      position: 'bottom',
                      duration : 3000,
                      type: 'success'
                    })
            })

          }
        }
      )

      .catch(error => {
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
           animationType="slide"
           >
           <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
             <View style={{margin: 22, backgroundColor:'#ffffff', borderRadius: 3}}>


                 <Button block success onPress={()=>this.setState({show_review_modal: !this.state.show_review_modal})} style={{margin: 4}}>
                   <Text style={{color:'#ffffff', margin: 2}}>خب</Text>
                 </Button>


             </View>
           </View>
         </Modal>

        <View style={{flex:1}}>
          <FlatList data={this.state.data}
            keyExtractor={item => item.uuid}
            refreshing = {this.state.refreshing}
            onRefresh={()=>this.handleRefresh()}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={4}
            initialNumToRender={4}
            extraData={this.state}
            ListEmptyComponent = {this.renderListEmpty}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
              <DeliverItem
                {...item}
                type = 'SO'
                deleteItem = {this.deleteItem}
              />
            }/>
        </View>

      </Container>
    )
  }
}
