import router from '@adonisjs/core/services/router'
import User from '#models/user'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/test-user', async () => {
  const user = await User.query().first()
  return user
})

router
  .group(() => {
    router.post('register', '#controllers/auth_controller.register')
    router.post('login', '#controllers/auth_controller.login')
    router.post('logout', '#controllers/auth_controller.logout').use(middleware.auth())
    router.get('me', '#controllers/auth_controller.me').use(middleware.auth())
  })
  .prefix('auth')

router
    .group(() => {
        router.get('/', '#controllers/channels_controller.index')
        router.post('/', '#controllers/channels_controller.store')
        router.post('/join', '#controllers/channels_controller.joinByName')
        router.post('/join/invite', '#controllers/channels_controller.joinByInvite').use(middleware.auth())

        router.get('/public/search', '#controllers/channels_controller.searchPublic')

        router.post('/:id/leave', '#controllers/channels_controller.leave')
        router.delete('/:id', '#controllers/channels_controller.destroy')

        router.post('/:id/invite', '#controllers/channels_controller.invite')
        router.post('/:id/revoke', '#controllers/channels_controller.revoke')
        router.post('/:id/decline', '#controllers/channels_controller.decline')

        router.post('/:id/kick', '#controllers/channels_controller.kick')
        router.post('/:id/ban', '#controllers/channels_controller.ban')
        router.post('/:id/unban', '#controllers/channels_controller.unban')

        router.get('/:id/members', '#controllers/channels_controller.members')

        router.get('/:id/messages', '#controllers/messages_controller.index')
        router.post('/:id/messages', '#controllers/messages_controller.store')

        router.get('/:id/typing', '#controllers/typing_controller.index')
        router.post('/:id/typing', '#controllers/typing_controller.store')
    })
    .prefix('channels')
    .use(middleware.auth())


router
  .group(() => {
    router.get('notifications', '#controllers/notifications_controller.index')
    router.patch('me/status', '#controllers/users_controller.updateStatus')
    router.patch('me/notifications', '#controllers/users_controller.updateNotificationSetting')
    router.patch('me/theme', '#controllers/users_controller.updateTheme')
    router.patch('users/me/profile', '#controllers/users_controller.updateProfile')
  })
  .use(middleware.auth())
