import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
} from 'react-native';
import Back from '../../common/back';



export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'duchao',
        times: 0,
      }
    }
  }
  componentDidMount() {
    const user = this.state.user;

    AsyncStorage
      .getItem('user')
      .catch(e => {
        console.log(e,'error1');
      })
      .then(data => {
        console.log('1', data);
        data = JSON.parse(data);
        this.setState({
          user: data,
        }, () => {
          user.times++;
          const userData = JSON.stringify(this.state.user);
          console.log(e);
          console.log('1,getItem');
          AsyncStorage
            .setItem('user', userData)
            .then(() => {
              console.log('save ok 2');
            })
            .catch(e => {
              console.log(e);
            });
        })
      })
  }
  removeStorage() {
    AsyncStorage
      .removeItem('user')
      .then(() => {
        console.log('remove success')
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this.removeStorage.bind(this)}>删除信息</Text>
        <Text>我存储的次数是 {this.state.user.times}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  }
})