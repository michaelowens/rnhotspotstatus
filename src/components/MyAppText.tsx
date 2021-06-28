import React, {Component} from 'react'
import {Text} from 'react-native'

const defaultTextStyle = {
  fontFamily: 'Assets/Inter.ttf#Inter',
  color: '#fff',
  lineHeight: 20,
}

const MyAppText: React.FC<{style?: any; children: any}> = props => (
  <Text style={[defaultTextStyle, props.style]}>{props.children}</Text>
)

export default MyAppText
