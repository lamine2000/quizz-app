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
              answers: question.answers,
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
                );
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
                answers: question.answers,
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
                    );
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

  addQuestion(question: Question, quizz_id: string) : Promise<DocumentReference<unknown>> {
    return this.firestore.collection(`quizzes/${quizz_id}/questions`).add({
      text: question.text,
      answers: question.answers,
      correctAnswerId: question.correctAnswerId
    });
  }

  addQuestionById(question: Question, question_id: string, quizz_id: string): Promise<void>{
    return this.firestore.doc(`quizzes/${quizz_id}/questions/${question_id}`).set({
      id: question_id,
      text: question.text,
      answers: question.answers,
      correctAnswerId: question.correctAnswerId
    });
  }

  removeQuestion(question_id: string, quizz_id: string): Promise<void> {
    return this.firestore.doc(`quizzies/${quizz_id}/questions/${question_id}`).delete();
  }

  modifyQuestion(question: Question, question_id: string, quizz_id: string): Promise<void> {
    return this.removeQuestion(question_id, quizz_id)
      .then(() => {
        this.addQuestionById(question, question_id, quizz_id);
      });
  }

  addAnswerToQuestion(answer: Answer, question_index: number, quizz_id: string): void {

  }

  removeAnswerFromQuestion(answer_index: number, question_index: number, quizz_id: string): void{

  }

  modifyAnswerOfQuestion(answer: Answer, answer_index: number, question_index: number, quizz_id: string): void {

  }

  retrieveAnswersFromQuestion(question_index: number, quizz_id: string): void{

  }

  retrieveQuestionsFromQuizz(quizz_id: string): void{

  }

  // @ts-ignore
  getQuizzById(quizz_id: string): Question{

  }


}

//todo: CRUD for Questions of an already existing quizz
//todo: Upload a quizz on firestore

