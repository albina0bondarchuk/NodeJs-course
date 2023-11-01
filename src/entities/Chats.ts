import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class Chats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "creator_id",
    referencedColumnName: "id",
  })
  creator: Users;

  @ManyToMany((type) => Users)
  @JoinTable({
    name: "chat_user",
    joinColumn: {
      name: "chat_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  users: Users[];

  @Column({ name: "created_at", type: "timestamptz", nullable: false })
  createdAt: Date;

  @Column({ name: "modified_at", type: "timestamptz", nullable: true })
  modifiedAt: Date;

  @Column()
  status: number;

  @Column()
  type: number;

  @Column({ nullable: true })
  icon: string;
}
