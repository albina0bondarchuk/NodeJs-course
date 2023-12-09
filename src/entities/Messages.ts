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
import { Chats } from "./Chats";

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne((type) => Users)
  creator: Users;

  @ManyToOne((type) => Chats)
  chat: Chats;

  @ManyToMany((type) => Users)
  @JoinTable({
    name: "readed_message_by_user",
    joinColumn: {
      name: "message_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  readBy: Users[];

  @Column({ type: "timestamptz" })
  createdAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  modifiedAt: Date;

  @Column()
  status: number;

  @Column({ nullable: true })
  referenceTo: number;

  @Column({ nullable: true })
  forwardedBy: number;
}
