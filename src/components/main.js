import React, { Component } from 'react';
import {View, Modal, TouchableHighlight,FlatList, ActivityIndicator, AsyncStorage} from 'react-native';
import { Icon } from 'react-native-elements';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import { Actions } from 'react-native-router-flux';
import PostItem from './postItem.js';
import {Container, Header, Title} from 'native-base';
import {base_url} from '../serverAddress.js';



export default class Main extends Component{

  static navigationOptions = {
    tabBarLabel: 'خانه',
    tabBarIcon: () => (<Icon size={24} color="white" name="home" />)
  }


  constructor(props){
    super(props);
    this.state = {
      sampleFeed:null,
      loading: false,
      next_page : base_url,
      error : null,
      refreshing : false,
      page :1,
      token : null,
    };
  }

  componentWillMount(){

  }

  componentDidMount(){
    AsyncStorage.getItem('@Token:key')
    .then( (value) =>{
        if (value != null){
          this.setState({token: value})
          this.makeRemoteRequest(value)
        } else{
          //TODO : handle this shit
        }
      }
    );
  }
  makeRemoteRequest = (token) => {
    const { page } = this.state;
    this.setState({ loading: true });
    next_url = ''
    if (page === 1) {
      next_url = base_url
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
         this.makeRemoteRequest(this.state.token);
       }
     );
   };

  handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          this.makeRemoteRequest(this.state.token);
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
      <Container>
        <Header androidStatusBarColor="#263238" style={{backgroundColor: '#37474F'}}>
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' ,flex:1}} >
            <Icon name='inbox' color='white' size={31} />
          </View>
          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:2}}>
              <Title style={{ color: '#ffffff', fontWeight:'bold'}}>selmino</Title>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' ,flex:1}}>
            <Icon name="search" color='#ffffff' size={31}/>
          </View>
        </Header>
        <View style={{flex:1}}>
          <FlatList data={this.state.data}
            keyExtractor={item => item.post.uuid}
            refreshing = {this.state.refreshing}
            onRefresh={()=>this.handleRefresh()}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={4}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
              <PostItem
                {...item}
                openProfilePage = {this.props.openProfilePage}
              />
            }/>
        </View>
      </Container>
    )
  }
}



// function mapStateToProps(state){
//   return{
//     token : state.activeToken
//   };
// }
//
// function matchDispatchToProps(dispatch){
//   return bindActionCreators({}, dispatch)
// }
//
// export default connect(mapStateToProps, matchDispatchToProps)(Main);
