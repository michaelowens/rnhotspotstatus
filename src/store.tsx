import AsyncStorage from '@react-native-async-storage/async-storage'
import {useEffect, useRef} from 'react'
import {useState} from 'react'
import {createContainer} from 'react-tracked'
import IDevice from './models/Device'

const initialState: {
  config: any
  devices: {[key: string]: IDevice}
} = {
  config: {},
  devices: {},
}

const useMyState = () => {
  const [state, setState] = useState(initialState)
  const loading = useRef(false)
  const loaded = useRef(false)

  useEffect(() => {
    ;(async () => {
      console.log(loaded.current)

      if (loaded.current) {
        console.log('config changed!')
        AsyncStorage.setItem('settings', JSON.stringify(state))
      } else if (!loading.current) {
        loading.current = true
        try {
          const value = await AsyncStorage.getItem('settings')
          const loadedValue = JSON.parse(value)
          if (loadedValue) {
            setState(loadedValue)
          }
        } catch (e) {
          console.log('Could not get settings')
        }
        // this is rather ugly..
        setTimeout(() => (loaded.current = true))
      }
    })()
  }, [state])

  return [state, setState]
}

export const {Provider: SharedStateProvider, useTracked: useSharedState} =
  createContainer(useMyState)
