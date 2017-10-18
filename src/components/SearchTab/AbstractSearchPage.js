import React, { Component } from 'react';
import {View, FlatList, StatusBar, ActivityIndicator, Text, Modal, TextInput, TouchableWithoutFeedback} from 'react-native';
import { Icon } from 'react-native-elements';
import { Button ,Content, Header, Body, Title, List, Toast, Card} from 'native-base';
import {} from '../../requestServer.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SInfo from 'react-native-sensitive-info';
import AbstractPostIncludedPage from '../AbstractPostIncludedPage.js';
import InvestComponent from '../InvestComponent.js';


export default class AbstractSearchPage extends AbstractPostIncludedPage{
  constructor(props){
    super(props);
    this.state = {
      ...this.state,
      loading: false,
      error : null,
      refreshing : false,
      height: 60,
      next_page : -1,
      search_query : undefined,
      no_results: false,
     }
     
  }


  componentDidMount(){
    super.componentDidMount();
  }



  makeRemoteRequest = (init) => {
    if(!this.state.search_query){
      return;
    }
    let search_query = this.props.normalizeQuery(this.state.search_query)
    this.setState({ loading: true });

    let onSuccess = (res)=>{
      no_results = res.results.length === 0;
      if(init){
        this.props.initData(res.results)
      }else{
        this.props.loadMore(res.results)
      }
      this.setState({
        loading: false,
        refreshing: false,
        next_page : res.next,
        no_results ,
      });
    };
    let onError = (error) =>{
      this.setState({ error, loading: false , no_results:true});
      console.log(error);
    };
    this.props.search(this.token, this.state.next_page , search_query, onSuccess, onError)

  };

  handleRefresh = () => {
     if(!this.state.search_query){
       return
     }
     this.setState(
       {
         next_page: -1,
         refreshing: true
       },
       () => {
        this.makeRemoteRequest(true)
       }
     );
   };

   handleLoadMore = () => {
     this.makeRemoteRequest(false)
   };

   loadingTopCompeleted = () =>{}



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
      if(!this.state.loading && this.state.no_results){
        return(

          <View style={{ justifyContent:'center', padding:15}}>

            <Text style={{fontWeight:'bold'}}>موردی پیدا نشد</Text>
          </View>


        )
      }else {
        return (<View/>)
      }

    }
    openPostDetail = (profilePost) =>{
      this.props.navigation.navigate('PostDetailPage', {profilePost})
    }

    render(){

      return(
        <View style={{flex:1}}>

          <Card style={{flex:0}}>
            <View style={{ flexDirection: 'row', backgroundColor:'white'}}>
              <TextInput underlineColorAndroid='transparent' placeholderTextColor='gray'
                placeholder={this.props.searchText} style={{flex:1, height: 45}}
                onChangeText={(text)=>{this.setState({search_query: text, next_page: -1, no_results: false})}}/>
              <Button light  onPress={()=>{this.setState({data:[]},()=> this.makeRemoteRequest(true))}}>
                <Icon  style={{padding: 6}} name='search' />
              </Button>

            </View>
          </Card>


          <FlatList 
            data={this.props.data}
            keyExtractor={this.props.keyExtractor}
            refreshing = {this.state.refreshing}
            onRefresh={this.handleRefresh}
            onEndReached={this.handleLoadMore}
            ListEmptyComponent = {this.renderListEmpty}
            onEndReachedThreshold={4}
            initialNumToRender={4}
            extraData={this.state}
            ListFooterComponent={this.renderFooter}
            numColumns = {this.props.numberOfColumns}
            contentContainerStyle={{ alignItems: 'stretch'}}
            renderItem={({item}) =>{
              item.openPostDetail = this.openPostDetail;
              item.current_location = this.state.current_location;
              item.openProfilePage = this.props.openProfilePage;
              return this.props.renderItem(item);
            }}/>
        </View>
      )

    }

}
