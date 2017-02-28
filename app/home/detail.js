import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View,
    Text,
    Image,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Back from '../../common/back';

export default class Detail extends Component {
    constructor(props){
        super(props);
        let navigator = this.props.navigator;
        this.state = {
            navigator:navigator,
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.head}>
                    <TouchableOpacity onPress={() => Back(this.state.navigator)}>
                        <View>
                            <Icon name="ion-ios-arrow-thin-left" style={styles.backIcon}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f5f5f5',
    }
})