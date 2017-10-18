import React, { Component , PureComponent} from 'react';
import UserListPage from './UserListPage';
import {requestUserFollowers, requestUserFollowings} from '../requestServer.js';
import {View} from 'react-native';

export default class FollowUsers extends Component{
    username = this.props.navigation.state.params.username;
    is_followers = this.props.navigation.state.params.is_followers;
    
    requestServer = (next_page, onSuccess, onFailed)=>{
        if(this.is_followers){
            return requestUserFollowers(next_page, this.username, onSuccess, onFailed);
        }else{
            return requestUserFollowings(next_page, this.username, onSuccess, onFailed)
        }
    }
    openProfilePage = (username)=>{
        this.props.navigation.navigate('OtherProfilePage', {username})
    }
    render(){
        return(
            <View>
                <UserListPage
                    requestServer = {this.requestServer}
                    openProfilePage = {this.openProfilePage}
                />
            </View>
            
          
        )
     
       
    }

}