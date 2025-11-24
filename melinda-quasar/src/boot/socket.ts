import { boot } from 'quasar/wrappers'
import { wsClient } from 'src/ws/client'

export default boot(() => {
  wsClient.connect()
})