import {Question} from "./question.model";

export class Quizz{
  constructor(
    public id: string, //todo: try to generate uuid
    public nb_players: number,
    public max_score: number,
    public questions:  Question[]
  ) {
  }
}
