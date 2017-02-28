import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View,
    Text,
    Image,
    TextInput,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Back from '../../common/back';

const { width,height } = Dimensions.get('window');
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
                <StatusBar barStyle="default"/>
                <View style={styles.head}>
                    <TouchableOpacity onPress={() => Back(this.state.navigator)}>
                        <View style={styles.backBtn}>
                            <Icon name="ios-arrow-back" style={styles.backIcon}/>
                            <Text style={styles.backText}>返回</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.headTitle}>
                        <Text style={styles.headText} numberOfLines={1}>视频详情页</Text>
                    </View>
                </View>
                <View style={styles.videoBox}>
                    <Text>我是视频</Text>
                </View>
                {/*我是测试注释， git*/}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f5f5f5',
    },
    head: {
        paddingTop:20,
        paddingBottom:12,
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    backBtn: {
        width:50,
        marginLeft:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
    },
    backIcon: {
        fontSize:22,
        color: '#ed7b66'
    },
    backText:{
        color: '#333',
    },
    headTitle: {
        width:width - 120,
        alignSelf: 'center'
    },
    headText: {
        textAlign: 'center',
        fontSize: 16,
        color:'#333',
    }
})