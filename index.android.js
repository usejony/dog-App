/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component
} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class RN1 extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>哈哈。我是sublime 的 github测试</Text>
        <Text>哈哈哈</Text>
        <Text>我再来测试一下啊</Text>
        <Text>哈哈，我这是第三次测试，咋样</Text>
        <Text>我在测试I一下</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RN1', () => RN1);