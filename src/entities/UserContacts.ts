import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class UserContacts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Users)
  owner: Users;

  @ManyToOne((type) => Users)
  contact: Users;

  @Column({ nullable: true })
  name: string;
}
