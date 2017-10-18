import React, { Component , PureComponent} from 'react';
import {connect} from 'react-redux';
import {FlatList, View, Text, Dimensions, TextInput, ActivityIndicator, StatusBar, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {bindActionCreators} from 'redux';
import {getTimeAgo} from '../utility/TimerUtil.js';
import {Toast, Header, Title, Button} from 'native-base';
import {loadPostComments, sendComment, updatePost as requestUpdatePost, reportComment} from '../requestServer.js'
import {Icon, Avatar} from 'react-native-elements';
import { updatePost} from '../actions/feedsActions.js';
import SInfo from 'react-native-sensitive-info';


class CommentItem extends PureComponent{

  render(){
    return(
    <View style={{padding: 5, backgroundColor:'white', margin: 5, borderRadius: 4}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Icon name='more-vert' color='#9E9E9E' onPress={()=>{this.props.selectComment(this.props)}}/>
        <Text style={{fontWeight:'100', fontSize: 11}}>{getTimeAgo(new Date(this.props.time).getTime()/1000)}</Text>
        <Text style={{flex:1, margin: 5, fontWeight:'bold', textAlign:'right'}}>{this.props.user.full_name}</Text>
        <Avatar rounded source={{uri:this.props.user.avatar_url}}/>
      </View>
      <Text>{this.props.text}</Text>

    </View>)

  }
}

class CommentPage extends Component {
  static navigationOptions = {
    tabBarLabel: 'اتفاقات؟',
  }
  post_uuid = this.props.navigation.state.params.post_uuid
  token = this.props.navigation.state.params.token
  post_title = this.props.navigation.state.params.post_title

 componentDidMount(){
   this.makeRemoteRequest(this.token)
   SInfo.getItem('username', {
   sharedPreferencesName: 'mifroosham',
   keychainService: 'mifroosham'}).then(value => {
       this.setState({my_username: value})
   });
 }
 constructor(props){
   super(props);
   this.state = {
     loading: false,
     error : null,
     refreshing : false,
     page :1,
     data: [],
     height: 60,
     comment : null,
     loading_add_comment : false,
     selected_comment : undefined,
     show_comment_modal : false,
     my_username : undefined,
     show_report_options : false,
     report_inappropriate : false,
     report_insult: false,
     report_spam : false,
     report_other : false,
    }


 }



 isItMe = (comment)=>{
   if(comment && this.state.my_username){
     if(comment.user.username === this.state.my_username){
       return true;
     }
   }
   return false;
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
       page : this.state.page + 1
     });
   };
   let onError = (error) =>{
     this.setState({ error, loading: false });
     console.log(error);
   };
   loadPostComments(page , this.post_uuid, token, onSuccess, onError)

 };

 addComment = ()=>{
   this.setState({loading_add_comment: true})
   let onSuccess = (res)=>{
     console.log(res);
     newPost = res
     newPost.time = new Date()
     this.setState({loading_add_comment: false, comment: '', data: [...this.state.data, newPost]})
     this.updatePost()

   }
   let onFailed = (error) =>{
     console.log('send_post_error', error);
     this.setState({loading_add_comment : false})
   }
   sendComment(this.token, this.post_uuid, this.state.comment, onSuccess, onFailed)
 }

 updateSize = (height) => {
  this.setState({
    height
  });
}


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

 updatePost = ()=>{
   let onSuccess = (res) =>{
     this.props.updatePost(res)
   }
   let onError = (error) =>{
     Toast.show({
             text: 'خطایی بوجود آمد',
             position: 'bottom',
             duration : 3000,
             type: 'danger'
           })
   }
   requestUpdatePost(this.token, this.post_uuid, onSuccess, onError)
 }

 selectComment = (comment) =>{
   this.setState({selected_comment : comment, show_comment_modal: true, show_report_options: false})
 }

 render(){
   const {newValue, height} = this.state;

    let newStyle = {
      height,
      margin: 5,
      flex:1,
      borderRadius: 2,
      borderWidth:1,
      borderColor:'#E0E0E0'
    }

   return(
     <View style={{flex:1}}>
     <Header style={{backgroundColor: '#F5F5F5'}}>
       <StatusBar
          backgroundColor="#e0e0e0"
          barStyle="dark-content"
        />

       <View style= {{flexDirection:'column',alignItems: 'center',justifyContent: 'center' ,flex:1}}>
           <Title style={{ color: 'black', fontWeight:'bold'}}>{this.post_title}</Title>
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
            this.isItMe(this.state.selected_comment)  ?
              (
                <Button block light>
                  <Text style={{}}>حذف</Text>
                  <Icon  name='delete'/>
                </Button>

              )
              :
              (
                <Button block light onPress={()=>{this.setState({show_report_options: true, report_other: true})}}>
                  <Text style={{}}>گزارش</Text>
                  <Icon  name='report'/>
                </Button>

              )
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
           ref={(input) => {this.flatList = input; }}
           keyExtractor={item => item.uuid}
           renderItem={({item}) =>
             <CommentItem
                {...item}
                selectComment = {this.selectComment}
             />
           }/>
        <View style={{backgroundColor:'white',   width:Dimensions.get('window').width, flexDirection:'row', alignItems:'center'}}>
          <TextInput value={this.state.comment} multiline={true} onChangeText={(text) => {this.setState({comment: text})}} style={[newStyle]} placeholder='نظر شما...' onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}/>
          {this.state.loading_add_comment ?
            (
              <ActivityIndicator />
            )
            :
            (
              <Icon name='send' onPress={this.addComment} style={{padding:10}}/>
            )}

        </View>
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
export default connect(mapStateToProps, matchDispatchToProps)(CommentPage);
