import React from 'react'
import {View} from 'react-native'
import {Redirect} from 'react-router-native'
import BarChart from '../components/BarChart'
import MyAppText from '../components/MyAppText'

const Home = () => (
  <View
    style={{
      padding: 10,
      display: 'flex',
      flexWrap: 'wrap',
    }}>
    <Redirect to="/devices" />
    <MyAppText>Welcome back</MyAppText>
    <View
      style={{
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 5,
        height: 150,
        width: 400,
      }}>
      <MyAppText>Some stats</MyAppText>
      <BarChart></BarChart>
    </View>
  </View>
)

export default Home
