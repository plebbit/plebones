import createStore from 'zustand'
import localForage from 'localforage'

const settingsDb = localForage.createInstance({name: `plebonesSettings`})

const useSettingsStore = createStore((setState, getState) => ({
  settings: {},
  setSetting: async (settingName, settingValue) => {
    setState(state => ({
      settings: {...state.settings, [settingName]: settingValue}
    }))
    settingsDb.setItem(settingName, settingName)
  },
  resetSettings: async () => {
    setState({settings: {}})
    settingsDb.clear()
  }
}))

const useSetting = (settingName) => {
  const settingValue = useSettingsStore(state => state.settings[settingName])
  const setSetting = useSettingsStore(state => state.setSetting)
  const setSettingValue = (settingValue) => setSetting(settingName, settingValue)
  return [settingValue, setSettingValue]
}

export default useSetting
