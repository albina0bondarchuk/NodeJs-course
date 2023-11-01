import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm'
import { Chats } from './Chats'
import { Users } from './Users'

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne((type) => Users)
    @JoinColumn({
        name: 'chat_id',
        referencedColumnName: 'id',
    })
    chat: Chats

    @Column({ type: 'json', nullable: true })
    chatSetting: object
}
