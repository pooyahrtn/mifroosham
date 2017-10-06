import React, { Component } from 'react';
import { reportComment} from '../requestServer.js'
import { View, Text, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import {bindActionCreators} from 'redux';
import { Card ,  Thumbnail, Button, Header, Title, Toast} from 'native-base';
import { Icon } from 'react-native-elements';


export default class ReportComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      show_report_options : false,
      report_inappropriate : false,
      report_insult: false,
      report_spam : false,
      report_other : false,
    }
  }


  render(){
    return(
      <View style={{flex: 1, justifyContent:'center', backgroundColor:'rgba(0, 0, 0, 0.70)'}}>
        <View style={{borderRadius: 2, backgroundColor:'white', padding:5, margin: 5}}>
         {!this.state.show_report_options && (
           this.props.show_delete_option  ?
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
               <Button style={{flex:1, margin: 5, justifyContent:'center'}} light onPress={()=>{this.setState({show_report_options: false})}}>
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
    )
  }
}
