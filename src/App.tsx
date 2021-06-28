import React from 'react'
import {ScrollView, View} from 'react-native'
import {NativeRouter, Route, BackButton} from 'react-router-native'
import Header from './components/Header'
import Home from './views/Home'
import DeviceList from './views/DeviceList'
import {ToastProvider} from 'react-native-fast-toast'
import {SharedStateProvider} from './store'

// const getData = async () => {
//   try {
//     const value = await AsyncStorage.getItem('devices')
//     return value != null ? JSON.parse(value) : []
//   } catch (e) {
//     // error reading value
//     console.log('Could not get devices')
//   }
// }

const App: React.FC = () => {
  // getData().then(devices => console.log('Got devices:', devices))

  const backgroundStyle = {
    backgroundColor: '#181a1b',
    minHeight: '100%',
    display: 'flex',
  }

  return (
    <SharedStateProvider>
      <ToastProvider
        style={{paddingBottom: 30, paddingTop: 0}}
        textStyle={{marginTop: -10}}
        offset={10}>
        <NativeRouter>
          <BackButton>
            <View style={backgroundStyle}>
              <Header />
              <Route exact path="/" component={Home} />
              <Route path="/devices" component={DeviceList} />
            </View>
          </BackButton>
        </NativeRouter>
      </ToastProvider>
    </SharedStateProvider>
  )
}

export default App
