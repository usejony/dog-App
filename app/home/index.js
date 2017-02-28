import React, { Component } from 'react';
import {
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	View,
	Text,
	ListView,
	Image,
	ActivityIndicator,
	RefreshControl,
	Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { GET, POST } from '../../common/request';
import config from '../../common/config';
import Detail from './detail';


const { width, height } = Dimensions.get('window');
const cacheResults = {
	nextPage: 1,
	items: [],
	total: 0,
}
class Item extends Component {
	constructor(props) {
		super(props);
		const row = this.props.row;
		this.state = {
			row: row,
			up: row.voted,
		}
	}

	_up() {
		let row = this.state.row;
		let up = !this.state.up;
		let url = config.api.base + config.api.up;
		let body = {
			id: row._id,
			accessToken: 'dudu',
			up: up ? true : false
		}
		POST(url, body)
			.then(data => {
				if (data && data.success) {
					this.setState({
						up: up
					})
				} else {
					Alert.alert('点赞失败，请稍后再试！');
				}
			})
			.catch(err => {
				Alert.alert('点赞失败，请稍后再试！');
				console.log(err);
			});
	}

	render() {
		const row = this.state.row;
		return (
			<TouchableHighlight underlayColor="#eee" onPress={this.props.onSelect}>
				<View style={styles.item}>
					<Text style={styles.itemTitle}>{row.title}</Text>
					<Image
						source={{ uri: row.thumb }}
						style={styles.itemThumb}
					>
						<Icon name="ios-play" style={styles.play} />
					</Image>
					<View style={styles.itemFooter}>
						<View style={styles.handleBox}>
							<Icon onPress={this._up.bind(this)} name={this.state.up ? "ios-heart" : "ios-heart-outline"} style={[styles.up, this.state.up ? null : styles.down]} />
							<Text style={styles.handleText} onPress={this._up.bind(this)}>喜欢</Text>
						</View>
						<View style={styles.handleBox}>
							<Icon name="ios-chatboxes-outline" style={styles.commentIcon} />
							<Text style={styles.handleText}>评论</Text>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}
export default class extends Component {
	constructor(props) {
		super(props);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});
		const navigator = this.props.navigator;
		this.state = {
			navigator:navigator,
			dataSource: ds.cloneWithRows([]),
			isLoadingTail: false,
			isRefreshing: false,
		}
	}

	_loadPage (){
		const navigator = this.state.navigator;
		navigator.push({
			name:'detail',
			component: Detail,
		})
	}

	_renderRow(row) {
		return <Item
			key={row._id}
			onSelect={() => this._loadPage(row)}
			row={row}/>
	}

	_fetchData(page) {
		const that = this;
		if (page !== 0) {
			this.setState({
				isLoadingTail: true,
			});
		} else {
			this.setState({
				isRefreshing: true,
			});
		}
		GET(config.api.base + config.api.creation, {
			accessToken: 'dudu',
			page: page
		})
			.then(data => {
				if (data && data.success) {
					let items = cacheResults.items.slice();
					if (page !== 0) {
						cacheResults.nextPage += 1;
						items = items.concat(data.data);
					} else {
						items = data.data.concat(items);
					}
					cacheResults.items = items;
					cacheResults.total = data.total;
					setTimeout(function () {
						if (page !== 0) {
							that.setState({
								isLoadingTail: false,
								dataSource: that.state.dataSource.cloneWithRows(cacheResults.items),
							});
						} else {
							that.setState({
								isRefreshing: false,
								dataSource: that.state.dataSource.cloneWithRows(cacheResults.items),
							});
						}
					}, 2000);
				}
			})
			.catch(e => {
				if (page !== 0) {
					this.setState({
						isLoadingTail: false,
					});
				} else {
					this.setState({
						isRefreshing: false,
					});
				}
				console.log(e);
			});
	}

	//上啦加载更多
	_renderFooter() {
		if (!this._hasMore() && cacheResults.total !== 0) {
			return (
				<View style={styles.loadingMore}>
					<Text style={styles.loadingText}>没有更多了</Text>
				</View>
			);
		}
		if (!this.state.isLoadingTail) {
			return (
				<View style={styles.loadingMore} />
			);
		}
		return (
			<View style={[styles.loadingMore, { paddingBottom: 50 }]}>
				<ActivityIndicator />
				<Text style={styles.loadingText}>努力加载中...</Text>
			</View>
		);
	}

	_fetchMore() {
		if (!this._hasMore() || this.state.isLoadingTail) {
			return;
		}
		let page = cacheResults.nextPage;
		this._fetchData(page);
	}

	_hasMore() {
		return cacheResults.items.length !== cacheResults.total;
	}

	//下拉刷新
	_onRefresh() {
		if (!this._hasMore() || this.state.isRefreshing) {
			return;
		}
		this._fetchData(0);
	}

	componentDidMount() {
		this._fetchData(1);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.head}>
					<Text style={styles.title}>首页</Text>
				</View>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this._renderRow.bind(this)}
					enableEmptySections={true}
					automaticallyAdjustContentInsets={false}
					onEndReached={this._fetchMore.bind(this)}
					onEndReachedThreshold={50}
					renderFooter={this._renderFooter.bind(this)}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this._onRefresh.bind(this)}
							title="玩命加载中..."
							tintColor="#ed7b66"
						/>
					}
				/>
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
	item: {
		marginBottom: 10,
		backgroundColor: '#fff',
	},
	itemTitle: {
		fontSize: 14,
		padding: 10,
		paddingLeft: 20,
	},
	itemThumb: {
		width,
		height: width * 0.56
	},
	play: {
		position: 'absolute',
		right: 14,
		bottom: 14,
		paddingLeft: 17,
		paddingTop: 5,
		width: 46,
		height: 46,
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 23,
		backgroundColor: 'transparent',
		fontSize: 35,
		color: '#ed7b66',
	},
	itemFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#eee'
	},
	handleBox: {
		padding: 10,
		width: width * 0.5 - 0.5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	handleText: {
		paddingLeft: 8
	},
	down: {
		fontSize: 20,
		color: '#333'
	},
	up: {
		fontSize: 20,
		color: '#ed7b66'
	},
	commentIcon: {
		fontSize: 20,
		color: '#333'
	},
	loadingMore: {
		flexDirection: 'row',
		marginVertical: 20,
		justifyContent: 'center',
	},
	loadingText: {
		color: '#777',
		paddingLeft: 10
	}
})