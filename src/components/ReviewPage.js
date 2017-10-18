import React, { Component , PureComponent} from 'react';
import {connect} from 'react-redux';
import {FlatList, View, Text, Dimensions, TextInput, ActivityIndicator,
   StatusBar, Modal, TouchableWithoutFeedback, Image} from 'react-native';
import {bindActionCreators} from 'redux';
import {getTimeAgo} from '../utility/TimerUtil.js';
import {Toast, Header, Title, Button} from 'native-base';
import {userReviews, reportComment} from '../requestServer.js'
import {Icon, Avatar, Rating} from 'react-native-elements';
import { updatePost} from '../actions/feedsActions.js';
import SInfo from 'react-native-sensitive-info';


class CommentItem extends PureComponent{

  render(){
    return(
    <View style={{ backgroundColor:'white', margin: 5, borderRadius: 4, flexDirection:'row'}}>
      <View style={{flex:1, padding:3}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Rating
              imageSize={12}
              readonly
              startingValue={this.props.rate}
              style = {{margin: 3}}
              />
            <Text style={{flex:1, padding: 3, fontWeight:'bold', textAlign:'right'}}>{this.props.reviewer.full_name}</Text>
            <Avatar rounded source={{uri:this.props.reviewer.avatar_url}}/>
          </View>
          {this.props.comment &&
            <Text>{this.props.comment}</Text>
          }
      </View>
        <Image style={{height: 80, width: 80, margin: 1, borderRadius:2}} source={{uri: this.props.image_url}}/>
    </View>)

  }
}

class ReviewPage extends Component {
  static navigationOptions = {
    tabBarLabel: 'اتفاقات؟',
  }
  token = this.props.navigation.state.params.token
  username = this.props.navigation.state.params.username

 componentDidMount(){
   this.makeRemoteRequest(this.token)
 }
 constructor(props){
   super(props);
   this.state = {
     loading: false,
     error : null,
     refreshing : false,
     page :1,
     data: [],
     show_comment_modal: false,
     show_report_options : false,
     report_inappropriate : false,
     report_insult: false,
     report_spam : false,
     report_other : false,
    }


 }




 toggleReport = (report_name) =>{
    reports = {report_other : false, report_spam: false, report_insult: false, report_inappropriate: false }
    reports[report_name] = true
    this.setState(reports)
 }

 makeRemoteRequest = (token) => {
   const { page } = this.state;
   this.setState({ loading: true });

   let onSuccess = (res)=>{
     this.setState({
       data : [...this.state.data, ...res.results],
       error: res.error || null,
       loading: false,
       refreshing: false,
       visit_version : res.visit_version,
       page: this.state.page + 1
     });
   };
   let onError = (error) =>{
     this.setState({ error, loading: false });
     console.log(error);
   };
   userReviews(token , this.state.page ,this.username, onSuccess, onError)

 };



 requestReportComment = ()=>{
   let status = ''
   if(this.state.report_inappropriate){
     status = 'IP'
   }else if (this.state.report_insult) {
     status = 'IN'
   }else if (this.state.report_spam){
     status = 'SP'
   }else {
     status = 'OT'
   }
   let onSuccess = (res)=>{
     Toast.show({
             text: 'گزارش ثبت شد',
             position: 'bottom',
             duration : 3000,
             type: 'success'
           })

   }
   let onFailed = (error) =>{
     Toast.show({
             text: 'گزارش ثبت شده است.',
             position: 'bottom',
             duration : 3000,
             type: 'success'
           })
   }
   reportComment(this.token, this.state.selected_comment.uuid, status, onSuccess, onFailed)
   this.setState({show_comment_modal: false})
 }



 selectComment = (comment) =>{
   this.setState({selected_comment : comment, show_comment_modal: true, show_report_options: false})
 }

 render(){


   return(
     <View style={{flex:1}}>
     <Header style={{backgroundColor: '#F5F5F5'}}>
       <StatusBar
          backgroundColor="#e0e0e0"
          barStyle="dark-content"
        />

       <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:1}}>
           <Title style={{ color: 'black', fontWeight:'bold'}}>{this.username}</Title>
       </View>


     </Header>
     <Modal
       transparent={true}
       visible={this.state.show_comment_modal}
       onRequestClose={() => {this.setState({show_comment_modal: !this.state.show_comment_modal})}}
       animationType="fade"
       >
       <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
         <View style={{borderRadius: 2, backgroundColor:'white', padding:5, margin: 5}}>
          {!this.state.show_report_options && (

              <Button block light onPress={()=>{this.setState({show_report_options: true, report_other: true})}}>
                <Text style={{}}>گزارش</Text>
                <Icon  name='report'/>
              </Button>

            )
          }

          {this.state.show_report_options &&
            <View>
              <TouchableWithoutFeedback onPress={()=>{this.toggleReport('report_inappropriate')}}>
                <View style={{flexDirection:'row', alignItems:'center', padding: 10}}>
                  <Text style={{flex:1, padding: 3}}>محتوای نامناسب</Text>
                  {this.state.report_inappropriate?(
                    <Icon color='#33691E' name='check-box' size={25} />
                  ):(
                    <Icon name='check-box-outline-blank'size={25}/>
                  )}
                </View>

              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={()=>{this.toggleReport('report_insult')}}>
                <View style={{flexDirection:'row', alignItems:'center', padding: 10}}>
                  <Text style={{flex:1, padding: 3}}>توهین و بی احترامی</Text>
                  {this.state.report_insult?(
                    <Icon color='#33691E' name='check-box' size={25} />
                  ):(
                    <Icon name='check-box-outline-blank'size={25}/>
                  )}
                </View>

              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{this.toggleReport('report_spam')}}>
                <View style={{flexDirection:'row', alignItems:'center', padding: 10}}>
                  <Text style={{flex:1, padding: 3}}>اسپم</Text>
                  {this.state.report_spam?(
                    <Icon color='#33691E' name='check-box' size={25} />
                  ):(
                    <Icon name='check-box-outline-blank'size={25}/>
                  )}
                </View>

              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{this.toggleReport('report_other')}}>
                <View style={{flexDirection:'row', alignItems:'center', padding: 10}}>
                  <Text style={{flex:1, padding: 3}}>سایر</Text>
                  {this.state.report_other?(
                    <Icon color='#33691E' name='check-box' size={25} />
                  ):(
                    <Icon name='check-box-outline-blank'size={25}/>
                  )}
                </View>

              </TouchableWithoutFeedback>

              <View style={{flexDirection:'row'}}>
                <Button style={{flex:1, margin: 5, justifyContent:'center'}} light onPress={()=>{this.setState({show_report_options: false, show_comment_modal: false})}}>
                  <Text style={{}}>بیخیال</Text>
                </Button>
                <Button style={{flex:1, margin: 5, justifyContent:'center'}} light onPress={()=>{this.requestReportComment()}}>
                  <Text style={{}}>گزارش</Text>

                </Button>
              </View>
            </View>
          }

         </View>
       </View>
     </Modal>
       <FlatList data={this.state.data}
           keyExtractor={item => item.uuid}
           renderItem={({item}) =>
             <CommentItem
                {...item}
                selectComment = {this.selectComment}
             />
           }/>
     </View>

   )
 }
}

function mapStateToProps(state){
 return{

 };
}
function matchDispatchToProps(dispatch){
 return bindActionCreators({updatePost}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ReviewPage);
