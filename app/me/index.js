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
	
	componentDidMount(){
	
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.head}>
					<Text style={styles.title}>个人中心</Text>
				</View>
				<View>
					<Text></Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	head: {
		paddingTop: 25,
		paddingBottom: 12,
		backgroundColor: '#ed7b66'
	},
	title: {
		fontSize: 16,
		textAlign: 'center',
		color: '#fff',
	},
})