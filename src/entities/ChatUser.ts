import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from "typeorm";
import { Users } from "./Users";
import { UserRole } from "../constants/chats";
import { Chats } from "./Chats";

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Users)
  user: Users;

  @ManyToOne((type) => Chats)
  @JoinColumn({
    name: "chat_id",
    referencedColumnName: "id",
  })
  chatId: number;

  @Column()
  role: UserRole;
}
