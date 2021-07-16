import React, {useRef} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import {StyleProp, StyleSheet, ViewStyle} from 'react-native'
import {View} from 'react-native'

const BarChart: React.FC<{
  style?: StyleProp<ViewStyle>
  data?: number[]
}> = ({style, data}) => {
  let [width, setWidth] = useState(0)
  let [barWidth, setBarWidth] = useState(5)
  let [highestValue, setHighestValue] = useState(data ? Math.max(...data) : 0)

  useEffect(() => {
    if (data?.length && width) {
      setHighestValue(Math.max(...data))
      let newWidth =
        (width - styles.bar.marginLeft * (data.length - 1)) / data.length
      console.log('width changed', width, data.length, newWidth)
      setBarWidth(Math.floor(newWidth))
    }
  }, [width, data])

  return (
    <View
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={[styles.container, style]}>
      {data &&
        data.map((value, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {height: (value / highestValue) * 100 + '%', width: barWidth},
              index === data.length - 1 ? {marginLeft: 0} : {},
            ]}></View>
        ))}
      {/* <View style={[styles.bar, {height: '75%'}]}></View>
      <View style={[styles.bar, {height: '100%', marginLeft: 0}]}></View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#00ff0022',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    flex: 1,
    // overflow: 'hidden',
  },
  bar: {
    backgroundColor: '#cccccc',
    borderRadius: 2,
    marginLeft: 5,
    minHeight: 1,
  },
})

export default BarChart
