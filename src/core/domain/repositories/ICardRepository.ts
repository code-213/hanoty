import { Card } from "../entities/Card";

export interface ICardRepository {
  findById(id: string): Promise<Card | null>;
  findByUserId(userId: string): Promise<Card[]>;
  findByStatus(status: string): Promise<Card[]>;
  save(card: Card): Promise<Card>;
  update(card: Card): Promise<Card>;
  permanentDelete(id: string): Promise<void>;
}
