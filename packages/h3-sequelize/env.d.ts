declare module 'h3' {
  interface H3EventContext {
    sequelize: import('@wxjs/sequelize')['Sequelize']
  }
}

export {};
