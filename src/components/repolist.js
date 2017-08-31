import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Body, Title, Text, Button, Spinner, ListItem, Icon } from 'native-base';
import {connect} from 'react-redux';
import {FlatList} from 'react-native';
import {bindActionCreators} from 'redux';
// import { Actions } from 'react-native-router-flux';
import {getRepos, getRepoThunk, repoSelected} from '../actions/index';

class RepoList extends Component{
  componentWillMount(){
    this.props.getRepoThunk();
  }
  constructor(params){
    super(params);
    this.state = {
      loading: false
    }
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
    if(this.props.repos.length === 0){
    return(
      <Container>
          <Header>
          <Left>

          </Left>
          <Body>
              <Title>Repo List</Title>
          </Body>
          <Right />
          </Header>
          <Content contentContainerStyle= {{justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingHorizontal: 10}}>
            <Text style= {{fontSize: 30, fontWeight: 'bold', marginTop: 30, marginBottom: 30}}>Loading your repo List, Please wait</Text>
            <Spinner />
          </Content>
      </Container>
    );
  }
  else if(this.props.repos.length !== 0){
    return(
    <Container>
    <Header>
    <Left>

    </Left>
        <Body>
            <Title>GitHub Repo List</Title>
        </Body>
        <Right />
    </Header>
    <Content>
        <FlatList data={this.props.repos}
          keyExtractor={item => item.id}
          ListFooterComponent={this.renderFooter}
          refreshing = {true}
          onEndReached = {()=>{this.props.setGitPage(1)
          this.props.getRepoThunk(2)}}
          onEndThreshold = {0}
            renderItem={({item}) =>
                <ListItem onPress={() => {
                  this.props.repoSelected(item)}}>
                    <Text>{item.full_name}</Text>
                </ListItem>
                }>
          </FlatList>
    </Content>
    </Container>
  );
  }
  }
}

function mapStateToProps(state){
  return{
    repos : state.repos
  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({getRepos: getRepos, getRepoThunk: getRepoThunk, repoSelected: repoSelected}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(RepoList);
