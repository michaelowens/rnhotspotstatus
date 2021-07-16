import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import MyAppText from './MyAppText'
import NavigationLink from './NavigationLink'

const Header: React.FC = () => {
  return (
    <View>
      <View style={styles.topBar}>
        <MyAppText style={styles.topBarText}>Helios</MyAppText>
      </View>

      <View style={styles.navigation}>
        {/* <NavigationLink
          to="/"
          activeOnlyWhenExact
          style={styles.navigationItem}>
          Dashboard
        </NavigationLink> */}
        <NavigationLink to="/devices" style={styles.navigationItem}>
          Devices
        </NavigationLink>
        <NavigationLink to="/add-device" style={[styles.navigationItem]}>
          Add Device
        </NavigationLink>
        <NavigationLink to="/settings" style={[styles.navigationItem]}>
          Settings
        </NavigationLink>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#3730A3',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  topBarText: {
    fontWeight: '500',
    fontSize: 24,
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: '#2d3031',
    borderBottomWidth: 1,
  },
  navigationItem: {
    paddingLeft: 10,
    paddingRight: 10,
  },
})

export default Header
