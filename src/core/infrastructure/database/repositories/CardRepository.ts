import { injectable } from "inversify";
import { ICardRepository } from "../../../domain/repositories/ICardRepository";
import { Card, CardStatus } from "../../../domain/entities/Card";
import { CardModel } from "../models/CardModel";

@injectable()
export class CardRepository implements ICardRepository {
  async findById(id: string): Promise<Card | null> {
    const cardModel = await CardModel.findByPk(id);
    return cardModel ? this.toDomain(cardModel) : null;
  }

  async findByUserId(userId: string): Promise<Card[]> {
    const cardModels = await CardModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return cardModels.map((model) => this.toDomain(model));
  }

  async findByStatus(status: string): Promise<Card[]> {
    let where: any = {};

    if (status !== "all") {
      where.status = status;
    }

    const cardModels = await CardModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return cardModels.map((model) => this.toDomain(model));
  }

  async save(card: Card): Promise<Card> {
    const cardJSON = card.toJSON();
    const cardModel = await CardModel.create({
      title: cardJSON.title,
      userId: cardJSON.userId,
      status: cardJSON.status,
      views: cardJSON.views,
      clicks: cardJSON.clicks,
      flagReason: cardJSON.flagReason,
    });

    return this.toDomain(cardModel);
  }

  async update(card: Card): Promise<Card> {
    const cardJSON = card.toJSON();
    await CardModel.update(
      {
        title: cardJSON.title,
        status: cardJSON.status,
        views: cardJSON.views,
        clicks: cardJSON.clicks,
        flagReason: cardJSON.flagReason,
      },
      { where: { id: card.id } }
    );

    return card;
  }

  async permanentDelete(id: string): Promise<void> {
    await CardModel.destroy({ where: { id }, force: true });
  }

  private toDomain(model: CardModel): Card {
    return new Card({
      id: model.id,
      title: model.title,
      userId: model.userId,
      status: model.status as CardStatus,
      views: model.views,
      clicks: model.clicks,
      flagReason: model.flagReason,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
