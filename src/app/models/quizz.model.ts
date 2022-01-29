import {Question} from "./question.model";

export class Quizz{
  constructor(
    public id: string, //todo: try to generate uuid
    public nbPlayers: number,
    public maxScore: number,
    public questions:  Question[]
  ) {
  }
}
