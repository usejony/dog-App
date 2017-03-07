import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import Picker from 'react-native-picker';
let data = [];
for (var i = 0; i < 100; i++) {
  data.push(i);
}

const { width, height } = Dimensions.get('window');
export default class Creation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'jave'
    }
  }
  show() {
    Picker.init({
      pickerData: data,
      selectedValue: [59],
      onPickerConfirm: data => {
        console.log(data);
      },
      onPickerCancel: data => {
        console.log(data);
      },
      onPickerSelect: data => {
        console.log(data);
      }
    });
    Picker.show();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>我是creation页面</Text>
        <Text>我是来测试home code normal</Text>
        {/*<View style={{borderColor:"green",borderWidth:1,position:'absolute',bottom:2,width,height:250,backgroundColor:'#eee'}}>
          <Text>选择</Text>
        <Picker
          selectedValue={this.state.language}
          onValueChange={(lang) => this.setState({ language: lang })}>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
          <Picker.Item label="html" value="html" />
          <Picker.Item label="ccc" value="cc" />
        </Picker>
        </View>*/}
        <Text onPress={this.show.bind(this)}>显示</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
})