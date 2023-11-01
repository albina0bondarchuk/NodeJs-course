import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Users } from './entities/Users'
import { Settings } from './entities/Settings'
import { Chats } from './entities/Chats'
import { Messages } from './entities/Messages'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1111',
    database: 'messenger',
    entities: [Users, Settings, Messages, Chats],
    synchronize: true,
    logging: false,
})
