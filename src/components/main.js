import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList, ActivityIndicator, AsyncStorage} from 'react-native';
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';
import PostItem from './postItem.js';
import {base_url} from '../serverAddress.js';



class Main extends Component{

  constructor(props){
    super(props);
    this.state = {
      sampleFeed:null,
      loading: false,
      next_page : base_url,
      error : null,
      refreshing : false,
      page :1,
    };
  }

  componentDidMount(){
    this.makeRemoteRequest()
  }
  makeRemoteRequest = () => {
    const { page } = this.state;
    this.setState({ loading: true });
    next_url = this.state.next_page

    fetch(next_url,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.props.token
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
          next_page : res.next
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
         this.makeRemoteRequest();
       }
     );
   };

  handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };

  openProfilePage(user_id){
    this.props.userSelected(user_id);
  }
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

  render(){
    return(
      <FlatList data={this.state.data}
        keyExtractor={item => item.post.uuid}
        refreshing = {this.state.refreshing}
        onRefresh={()=>{}}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={10}
        ListFooterComponent={this.renderFooter}
        renderItem={({item}) =>
          <PostItem
            {...item}
            openProfilePage = {this.props.openProfilePage}
          />

        }/>
    )
  }
}



function mapStateToProps(state){
  return{
    token : state.activeToken
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Main);
