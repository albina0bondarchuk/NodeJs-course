import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Token {
  @PrimaryGeneratedColumn({ name: "token_id" })
  tokenId: string;

  @Column({ name: "user_id" })
  userId: string;
}
