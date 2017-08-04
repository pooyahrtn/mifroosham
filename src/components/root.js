import React, { Component } from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Badge,Content, Header, Body, Title, Text, Button, Footer, FooterTab} from 'native-base';
import { DefaultRenderer } from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';
import {tabSelected,userSelected ,getPendingNotifications, getPendingNotificationsThunk} from '../actions/index.js';
import Main from './main.js';
import HistoryPage from './historyPage.js';
import ProfilePage from './profilePage.js';
import IconBadge from 'react-native-icon-badge';
import {EnglighNumberToPersian} from '../utility/NumberUtils.js';




class Root extends Component{

  constructor(props){
    super(props);
    this.state = {currentTab: 0};
  }

  componentWillMount(){
    this.props.getPendingNotificationsThunk();
  }


  render(){

    return(
      <Container>
        <Header androidStatusBarColor="#263238" style={{backgroundColor: '#37474F'}}>
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' ,flex:1}} >
            {this.props.pendingNotifications.length > 0 ?
               (<TouchableWithoutFeedback onPress={()=>Actions.inbox()}>
                  <Text style={{flex: 1, color:'white',textAlignVertical: "center",textAlign:'center', fontSize:24,fontWeight:'bold' ,height:32 , borderRadius: 16, backgroundColor:'red'}}>
                    {EnglighNumberToPersian(this.props.pendingNotifications.length)}
                  </Text>
                 </TouchableWithoutFeedback>):
               (<Icon name='inbox' color='white' size={31} onPress={()=>Actions.inbox()}/>)
             }
          </View>
          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:2}}>
              <Title style={{ color: '#ffffff', fontWeight:'bold'}}>میفروشم!</Title>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' ,flex:1}}>
            <Icon name="search" color='#ffffff' size={31}/>
          </View>
        </Header>
        <Content>
          <CurrentPage currentTab={this.state.currentTab}/>
        </Content>
        <Footer>
          <FooterTab style={{backgroundColor: '#ffffff'}}>
            <Button vertical onPress={() => {
              this.setState({currentTab: 0})
            }}>
              <Icon name="view-day" color={TabButtonColor(0, this.state.currentTab)} size={28}/>

            </Button>
            <Button vertical >
              <Icon name="stars" color={TabButtonColor(1,this.state.currentTab)} size={28}/>

            </Button>
            <Button vertical>
              <Icon name="add-circle-outline" color='#9E9E9E' size={28}/>

            </Button>
            <Button vertical  onPress={() => {
              this.setState({currentTab: 3})
            }}>
              <Icon active name="history" color={TabButtonColor(3,this.state.currentTab)} size={28} />

            </Button>
            <Button vertical onPress={() => {
              this.props.userSelected(0);
              this.setState({currentTab: 4})
            }}>
              <Icon name="person" color={TabButtonColor(4,this.state.currentTab)} size={28}/>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

function TabButtonColor(thisButtonIndex, selectedTab){
  if (selectedTab === thisButtonIndex) {
    return '#37474F';
  }
  else {
    return '#9E9E9E';
  }
}

function CurrentPage(props){
  const tabNumber = props.currentTab;
  if (tabNumber == 0) {
    return <Main/>;
  }
  else if (tabNumber == 3) {
    return <HistoryPage/>;
  }
  else if (tabNumber == 4) {
    return <ProfilePage/>;
  }
}

function mapStateToProps(state){
  return{
    tabSelected : state.tabSelected,
    pendingNotifications : state.pendingNotifications,
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({tabSelected : tabSelected,getPendingNotificationsThunk: getPendingNotificationsThunk, userSelected: userSelected}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Root);
