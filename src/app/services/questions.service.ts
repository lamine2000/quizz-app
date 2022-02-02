import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { Question } from '../models/question.model';
import {Answer} from "../models/answer.model";
import {Quizz} from "../models/quizz.model";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private firestore: AngularFirestore) {  }

  createQuizz(quizz: Quizz): void{
    //adds a quizz
    this.firestore.collection('/quizzes').add(
      {
        nb_players: quizz.nb_players,
        max_score: quizz.max_score,
      }
    )
      //adds that quizz's questions
      .then(
      (quizz_doc_ref) => {
        quizz.questions.forEach((question, index) => {
          quizz_doc_ref.collection(`questions`).add(
            {
              text: question.text,
              correctAnswerId: question.correctAnswerId
            }
          )
            //for each question, adds its answers
            .then(
            (question_doc_ref) => {
              question.answers.forEach((answer, index) => {
                question_doc_ref.collection(`answers`).add(
                  {
                    text: answer.text,
                    imageUrl: answer.imageUrl
                  }
                )
                  .then(() => {
                    /*quizz created on firesotore*/
                  });
              });
            }
            );
        });
      });
  }

  createQuizzById(quizz: Quizz, quizz_id: string): Promise<void>{
    //adds a quizz
    return this.firestore.doc(`quizzies/${quizz_id}`).set(
      {
        id: quizz_id,
        nb_players: quizz.nb_players,
        max_score: quizz.max_score,
      }
    )
      //adds that quizz's questions
      .then(
        () => {
          quizz.questions.forEach((question, index) => {
            this.firestore.collection(`quizzies/${quizz_id}/questions`).add(
              {
                text: question.text,
                correctAnswerId: question.correctAnswerId
              }
            )
              //for each question, adds its answers
              .then(
                (question_doc_ref) => {
                  question.answers.forEach((answer, index) => {
                    question_doc_ref.collection(`answers`).add(
                      {
                        text: answer.text,
                        imageUrl: answer.imageUrl
                      }
                    )
                      .then(() => {
                        /*quizz created on firesotore*/
                      });
                  });
                }
              );
          });
        });
  }

  deleteQuizz(quizz_id: string): Promise<void>{
    return this.firestore.doc(`quizzies/${quizz_id}`).delete();
  }

  modifyQuizz(quizz: Quizz, quizz_id: string): Promise<void>{
    return this.deleteQuizz(quizz_id)
      .then(() => {
        this.createQuizzById(quizz, quizz_id).then(() => {
          /*modifications done*/
        });
      });
  }

  addQuestionToQuizz(question: Question, quizz_id: string) : Promise<DocumentReference<unknown>> {
    return this.firestore.collection(`quizzes/${quizz_id}/questions`).add({
      text: question.text,
      answers: question.answers,
      correctAnswerId: question.correctAnswerId
    });
  }

  addQuestionToQuizzById(question: Question, question_id: string, quizz_id: string): Promise<void>{
    return this.firestore.doc(`quizzes/${quizz_id}/questions/${question_id}`).set({
      id: question_id,
      text: question.text,
      answers: question.answers,
      correctAnswerId: question.correctAnswerId
    });
  }

  removeQuestionFromQuizz(question_id: string, quizz_id: string): Promise<void> {
    return this.firestore.doc(`quizzies/${quizz_id}/questions/${question_id}`).delete();
  }

  modifyQuestion(question: Question, question_id: string, quizz_id: string): Promise<void> {
    return this.removeQuestionFromQuizz(question_id, quizz_id)
      .then(() => {
        this.addQuestionToQuizzById(question, question_id, quizz_id).then(() => {
          /*modification done*/
        });
      });
  }

  addAnswerToQuestion(answer: Answer, question_id: string, quizz_id: string): Promise<DocumentReference<unknown>> {
    return this.firestore.collection(`quizzies/${quizz_id}/questions/${question_id}/answers`).add({
      text: answer.text,
      imageUrl: answer.imageUrl
    });
  }

  addAnswerToQuestionById(answer: Answer, answer_id: string, question_id: string, quizz_id: string): Promise<void>{
    return this.firestore.doc(`quizzies/${quizz_id}/questions/${question_id}/answers/${answer_id}`).set({
      id: answer_id,
      text: answer.text,
      imageUrl: answer.imageUrl
    });
  }

  removeAnswerFromQuestion(answer_id: string, question_id: string, quizz_id: string): Promise<void>{
    return this.firestore.doc(`quizzies/${quizz_id}/questions/${question_id}/answers/${answer_id}`).delete();
  }

  modifyAnswerOfQuestion(answer: Answer, answer_id: string, question_id: string, quizz_id: string): Promise<void> {
    return this.removeAnswerFromQuestion(answer_id, question_id, quizz_id)
      .then(() => {
        this.addAnswerToQuestionById(answer, answer_id, question_id, quizz_id).then(() => {
          /*modification done*/
        });
      });
  }

  retrieveAnswersFromQuestion(question_id: string, quizz_id: string): Answer[] | void{
    let tab_answers: Answer[] = [];

    this.firestore.collection(`quizzies/${quizz_id}/questions/${question_id}/answers`).get()
      .subscribe(answers => {
        answers.forEach((answer) => {
          // @ts-ignore
          tab_answers.push(new Answer(answer.id, answer.data().text, answer.data().imageUrl));
        })
      },
      () => {},
        () => {return tab_answers;}
      );
  }

  retrieveQuestionsFromQuizz(quizz_id: string): Question[] | void{
    let tab_questions: Question[] = [];

    this.firestore.collection(`quizzies/${quizz_id}/questions`).get()
      .subscribe(questions => {
        questions.forEach(question => {
          let answers = this.retrieveAnswersFromQuestion(question.id, quizz_id);
          tab_questions.push(
            // @ts-ignore
            new Question(question.id, question.data().text, answers, question.data().correctAnswerId)
          );
        });
      },
      () => {},
      () => {return tab_questions;}
      );
  }

  // @ts-ignore
  retrieveQuizzById(quizz_id: string): Quizz{
    let questions = this.retrieveQuestionsFromQuizz(quizz_id);
    let retieved_quizz: Quizz;

    this.firestore.doc(`quizzies/${quizz_id}`).get()
      .subscribe(
        quizz => {
        // @ts-ignore
        retieved_quizz = new Quizz(quizz_id, quizz.data().nb_players, quizz.data().max_score, questions);
      },
        () => {},
        () => {return retieved_quizz;}
        );
  }
}
