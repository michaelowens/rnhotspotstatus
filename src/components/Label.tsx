import React from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import MyAppText from './MyAppText'

type LabelProps = {
  style?: StyleProp<ViewStyle>
  title: string
  color?: string
  size?: string
  bold?: boolean
  outline?: boolean
}

const Label: React.FC<LabelProps> = ({
  style,
  title,
  color,
  size = 'small',
  bold,
  outline,
}) => {
  return (
    <View
      style={[
        styles.default,
        styles[size],
        outline ? styles.border : styles.background,
        color ? {[outline ? 'borderColor' : 'backgroundColor']: color} : null,
        style,
      ]}>
      <MyAppText style={bold ? {fontWeight: '500'} : null}>{title}</MyAppText>
    </View>
  )
}

const styles = StyleSheet.create({
  default: {
    borderRadius: 6,
    width: 'auto',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  background: {
    backgroundColor: '#333',
  },
  border: {
    borderColor: '#333',
    borderWidth: 1,
  },
  small: {
    padding: 2,
    paddingLeft: 6,
    paddingRight: 6,
  },
  large: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
  },
})

export default Label
