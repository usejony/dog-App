import queryString from 'query-string';
import _ from 'lodash';
import config from './config';
import Mock from 'mockjs';

export const GET = function(url,params) {
    if(params){
        url += '?' + queryString.stringify(params)
    }
     return fetch(url)
    .then(response => response.json())
    .then(response => Mock.mock(response))
}
export const POST = function(url,body){
    const options = _.extend(config.header,{
        body:JSON.stringify(body)
    });
    return fetch(url,options)
        .then(response => response.json())
        .then(response => Mock.mock(response))
}