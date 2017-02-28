import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

export default class Creation extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>我是creation页面</Text>
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