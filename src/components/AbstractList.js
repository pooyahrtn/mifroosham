import React, { Component } from 'react';

export default class AbstractList extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            error : null,
            refreshing : false,
            next_page :-1,
            data: [],
            no_results : false,

        }
    }

    componentDidMount(){
        this.makeRemoteRequest(true)
    }

    makeRemoteRequest = (init) => {
        this.setState({ loading: true });
    
        let onSuccess = (res)=>{
          no_results = res.count === 0;
        //   console.error(res)
          this.setState({
            data : init ? res.results : [...this.state.data, ...res.results],
            loading: false,
            refreshing: false,
            next_page : res.next,
            no_results ,
          });
        };
        let onError = (error) =>{
          this.setState({ error, loading: false , no_results:true});
          console.error(error);
        };
        this.props.requestServer(this.state.next_page, onSuccess, onError)
    };

    handleRefresh = () => {
       
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
}