import { Document } from 'mongoose';
// import { IPlayer } from 'src/players/interfaces/player.interface';

export interface ICategory extends Document {
  _id: string;
  name: string;
  description: string;
  // events: Array<Event>;
  // players: Array<IPlayer>;
}

export interface IEvent extends Document {
  name: string;
  operation: string;
  value: number;
}
