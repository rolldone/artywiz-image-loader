import Client from "@root/app/main/models/Client"
import User from "@root/app/main/models/User"

export interface IItem {
  [key: string]: any;
}

export default <IItem>{
  guard : {
    web : {
      driver : 'session',
      provider : 'users'
    },
    api : {
      driver : 'jwt',
      provider : 'users',
      key : 'apakah ini untuk user?'
    },
    member_api : {
      driver : 'jwt',
      provider : 'clients',
      key : 'apakah ini untuk member?'
    },
    app : {
      driver : 'jwt',
      provider : 'apps',
      key : 'apakah ini untuk app?'
    }
  },
  provider : {
    users : {
      driver : 'sequelize',
      model : User
    },
    clients : {
      driver : 'sequelize',
      model : Client
    },
    apps : {
      driver : 'sequelize',
      model : null
    }
  }
}