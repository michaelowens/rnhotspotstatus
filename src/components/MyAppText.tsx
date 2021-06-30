import React from 'react'
import {StyleProp, Text, TextStyle} from 'react-native'

const defaultTextStyle = {
  fontFamily: 'Assets/Inter.ttf#Inter',
  color: '#fff',
  lineHeight: 20,
}

const MyAppText: React.FC<{style?: StyleProp<TextStyle>; children: any}> =
  props => <Text style={[defaultTextStyle, props.style]}>{props.children}</Text>

export default MyAppText
