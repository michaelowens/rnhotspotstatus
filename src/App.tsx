import React from 'react'
import {StyleProp, View, ViewStyle} from 'react-native'
import {NativeRouter, Route, BackButton} from 'react-router-native'
import Header from './components/Header'
import Home from './views/Home'
import DeviceList from './views/DeviceList'
import {ToastProvider} from 'react-native-fast-toast'
import {SharedStateProvider} from './store'
import Settings from './views/Settings'
import AddDevice from './views/AddDevice'
import Device from './views/Device'

const App: React.FC = () => {
  const backgroundStyle: StyleProp<ViewStyle> = {
    backgroundColor: '#181a1b',
    minHeight: '100%',
    display: 'flex',
  }

  return (
    <SharedStateProvider>
      <ToastProvider
        style={{paddingBottom: 30, paddingTop: 0}}
        textStyle={{marginTop: -10}}
        placement="bottom"
        offset={10}>
        <NativeRouter>
          <BackButton>
            <View style={backgroundStyle}>
              <Header />
              <Route exact path="/" component={Home} />
              <Route path="/add-device" component={AddDevice} />
              <Route path="/devices" component={DeviceList} />
              <Route path="/device/:deviceAddress" component={Device} />
              <Route path="/settings" component={Settings} />
            </View>
          </BackButton>
        </NativeRouter>
      </ToastProvider>
    </SharedStateProvider>
  )
}

export default App
