import React from 'react'
import {Button, View} from 'react-native'
import {useToast} from 'react-native-fast-toast'
import {useSharedState} from '../store'

const Settings: React.FC = () => {
  const [state, setState] = useSharedState()
  const toast = useToast()

  function clearDevices() {
    setState(prev => ({...prev, devices: []}))
    toast.show('Device list was cleared!', {type: 'success'})
  }

  return (
    <View style={{padding: 20}}>
      <Button title="Clear devices" onPress={clearDevices} color="#ff0000" />
    </View>
  )
}

export default Settings
