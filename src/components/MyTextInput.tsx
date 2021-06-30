import React from 'react'
import {StyleProp, StyleSheet, TextInput, TextStyle} from 'react-native'

const MyTextInput: React.FC<{
  style?: StyleProp<TextStyle>
  value?: string | undefined
  onChangeText?: (text: string) => void
}> = props => {
  const {style, ...otherProps} = props
  return <TextInput style={[styles.default, style]} {...otherProps} />
}

const styles = StyleSheet.create({
  default: {
    borderColor: '#3730A3',
    backgroundColor: '#121415',
    color: '#fff',
  },
})

export default MyTextInput
