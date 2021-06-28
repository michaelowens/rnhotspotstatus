import React from 'react'
import {View} from 'react-native'
import MyAppText from '../components/MyAppText'

const Home = () => (
  <View
    style={{
      padding: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}>
    <MyAppText>Welcome back</MyAppText>
  </View>
)

export default Home
