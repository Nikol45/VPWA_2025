declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    ws: import('socket.io').Server
  }
}
