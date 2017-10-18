import React, { Component , PureComponent} from 'react';
import {FlatList, View, Text, ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import {Icon, Avatar, Rating} from 'react-native-elements';
import AbstractList from './AbstractList.js';

class UserItem extends PureComponent{
    render(){
        return(
            <TouchableWithoutFeedback onPress={()=>this.props.openProfilePage(this.props.username)}>  
                <View style={{margin:3,
                flexDirection:'row', padding: 5, alignItems:'center',
                borderRadius:2, backgroundColor:'white'}}>
                    <View style={{padding:2, alignItems:'flex-end', flex:1}}>
                    <Text>{this.props.full_name}</Text>
                    <Text>@{this.props.username}</Text>
                    </View>
                    <Avatar rounded source={{uri: this.props.avatar_url}}/>

                </View>
            </TouchableWithoutFeedback>
        )
        
    }
}

export default class UserListPage extends AbstractList{
    constructor(props){
        super(props);
        this.state={
            ...this.state,
        }
    }

    
   render(){
       return(
        <FlatList
           data={this.state.data}
           keyExtractor={item => item.username}
           renderItem={({item}) =>
             <UserItem
                {...item}
                openProfilePage = {this.props.openProfilePage}
             />
           }
        />
       )
   }

}