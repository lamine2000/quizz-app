import { Answer } from "./answer.model";

export class Question{
  constructor(
    public id: string,
    public text: string,
    public answers: Answer[],
    public correctAnswerId: string
  ){}
}
