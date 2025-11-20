/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import User from '#models/user'

router.get('/test-user', async () => {
  const user = await User.query().first()

  return user
})

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
