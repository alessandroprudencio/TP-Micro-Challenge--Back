export interface ICategory extends Document {
  readonly _id: string;
  name: string;
  description: string;
  events: Array<Event>;
  // players: Array<IPlayer>;
}

export interface IEvent extends Document {
  name: string;
  operation: string;
  value: number;
}
