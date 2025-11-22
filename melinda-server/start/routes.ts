/*
|--------------------------------------------------------------------------
| routers file
|--------------------------------------------------------------------------
|
| The routers file is used for defining the HTTP routers.
|
*/

import router from '@adonisjs/core/services/router'
import User from '#models/user'
import { middleware } from '#start/kernel'


router.get('/test-user', async () => {
  const user = await User.query().first()

  return user
})

router.group(() => {
  router.post('register', '#controllers/auth_controller.register')
  router.post('login', '#controllers/auth_controller.login')
  router.post('logout', '#controllers/auth_controller.logout').use(middleware.auth())
  router.get('me', '#controllers/auth_controller.me').use(middleware.auth())
}).prefix('auth')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
