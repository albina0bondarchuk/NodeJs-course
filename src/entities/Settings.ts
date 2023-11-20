import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm'
import { Users } from './Users'

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne((type) => Users)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
    })
    userId: Users

    @Column({ type: 'json', nullable: true })
    chatSetting: object
}
