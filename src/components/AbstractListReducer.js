import React, { Component } from 'react';


export default class AbstractListReducer extends Component{
  token = undefined;

  constructor(props){
    super(props);
    this.state={
      loading: false,
      next_page : -1,
      error : null,
      refreshing : false,
    }
  }


  componentDidMount(){
    SInfo.getItem('token', {
    sharedPreferencesName: 'mifroosham',
    keychainService: 'mifroosham'}).then(value => {
        if (value != null){
          this.onTokenSet(value)
        } else{
          this.props.navigation.navigate('Authentication')
        }
      });
    }

    onTokenSet = (token) =>{

    }

    loadPage = (token, next_page, onSuccess, onFailed) =>{
      throw Error('you should implement loadPage');
    }

    initData = (res) =>{

    }

    loadMore = (res) =>{

    }

    onErrorLoadPage = (error) =>{

    }
    onSuccessLoadPage = (res)=>{

    }

    makeRemoteRequest = (token) => {
      this.setState({ loading: true });
    
      let onSuccess = (res)=>{
        if (this.state.next_page === -1){
          this.initData(res.results)
        }else{
          this.loadMore(res.results)
        }
        this.setState({
          error: res.error || null,
          loading: false,
          refreshing: false,
          next_page : res.next
        });
      }
      let onFailed = (error) =>{
        this.setState({ error, loading: false });

      }
      this.loadPage(token, this.state.next_page, onSuccess, onFailed);
    };

    handleRefresh = (token) => {
      
      this.setState(
        {
          refreshing: true,
          next_page : -1
        },
        () => {
          this.makeRemoteRequest(token)
        }
      );
    };

    handleLoadMore = () => {
      this.makeRemoteRequest(this.state.token)
    };
}
