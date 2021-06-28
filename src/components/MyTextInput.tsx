import React from 'react'
import {StyleSheet, TextInput} from 'react-native'

const MyTextInput: React.FC = props => {
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
