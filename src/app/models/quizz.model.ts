import {Question} from "./question.model";

export class Quizz{
  constructor(
    public id: string,
    public nb_players: number,
    public max_score: number,
    public questions:  Question[]
  ) {
  }
}
