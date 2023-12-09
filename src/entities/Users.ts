import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { ChatUser } from "./ChatUser";
import { UserContacts } from "./UserContacts";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany((type) => UserContacts, (contacts)=>contacts.owner)
  contacts: UserContacts[];

  @Column({ name: "created_at", type: "timestamptz", nullable: false })
  createdAt: Date;

  @Column({ name: "phone_number" })
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;
}
