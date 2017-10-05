
 import React, { Component } from 'react';
 import {
   AppRegistry,
   StyleSheet,
   Text,
   View
 } from 'react-native';
 import allReducers from './src/reducers/index.js';
 import App from './src/App.js';
 import thunk from 'redux-thunk'
 import {AsyncStorage} from 'react-native'
 import {compose, createStore, applyMiddleware} from 'redux';
 import {persistStore, autoRehydrate} from 'redux-persist'

 import {Provider} from 'react-redux';
 const store = createStore(allReducers,undefined, compose( applyMiddleware(thunk)), autoRehydrate);
 persistStore(store,{storage:AsyncStorage})

 export default class NativeBaseRedux extends Component {
   render() {
     return (
       <Provider store={store}>
        <App />
       </Provider>
     );
   }
 }

AppRegistry.registerComponent('Selmino', () => NativeBaseRedux);
