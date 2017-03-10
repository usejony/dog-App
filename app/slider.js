import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';

import Swi from 'react-native-swiper';
import Button from 'react-native-button'

const { width,height } = Dimensions.get('window');
export default class A extends Component {
  constructor(props){
    super(props);
    this.state = {
     slider:[
       require('../imgs/guide1.png'),
       require('../imgs/guide2.png'),
       require('../imgs/guide3.png')
     ]
    }
  }
  render(){
    return (
      <Swi style={styles.container} showsPagination={false} loop={false}>
        <View style={styles.slide1}>
          <Image source={this.state.slider[0]} style={styles.img}/>
        </View>
        <View style={styles.slide2}>
          <Image source={this.state.slider[1]} style={styles.img}/>
        </View>
        <View style={styles.slide3}>
          <Image source={this.state.slider[2]} style={styles.img}/>
          <Button style={styles.btn} onPress={this.props.enter}>立即体验</Button>
        </View>
      </Swi>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    // flex:1,
    // backgroundColor:"red"
  },
  slide: {
    width,
    flex:1,
    backgroundColor:'#ec735c'
  },
  img: {
    // flex:1,
    height,
    width,
  },
  btn: {
    position:'absolute',
    width:width - 20,
    left:10,
    bottom:50,
    padding:10,
    borderColor:'#ed7b66',
    borderWidth:1,
    borderRadius:8,
    color:'#ed7b66',
    backgroundColor:'transparent',
    fontSize:14,
  }
});