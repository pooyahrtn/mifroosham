import React, { Component } from 'react';
import {View, FlatList} from 'react-native';
import { Icon } from 'react-native-elements';
import { Container,Button ,Content, Header, Body, Title, List} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';
import DeliverItem from './deliverItem.js'
import {getPendingNotifications, getPendingNotificationsThunk} from '../actions/index';

 class InboxPage extends Component {
  componentDidMount(){
    // this.props.getPendingNotificationsThunk();
  }
  constructor(props){
    super(props);
  }
  render(){

    return(
      <Container>
        <Header androidStatusBarColor="#263238" style={{backgroundColor: '#37474F'}}>
          <View style= {{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start' ,flex:1}}>
            <Button transparent onPress= {()=>Actions.pop()}>
              <Icon name='arrow-back' color='#ffffff'/>
            </Button>
          </View>

          <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:2}}>
              <Title style={{ color: '#ffffff', fontWeight:'bold'}}>میفروشم!</Title>
          </View>
          <View style= {{flexDirection:'column',alignItems: 'flex-end',justifyContent: 'center' ,flex:1}}>
          </View>
        </Header>
        <Content>
            <FlatList data={this.props.pendingNotifications}
                keyExtractor={item => item.uuid}
                renderItem={({item}) =>
                  <DeliverItem
                    {...item}
                  />
                }/>

        </Content>

      </Container>
    )
  }
}

function mapStateToProps(state){
  return{
    pendingNotifications : state.pendingNotifications
  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({getPendingNotificationsThunk: getPendingNotificationsThunk}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(InboxPage);
