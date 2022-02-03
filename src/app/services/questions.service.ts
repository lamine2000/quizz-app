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

  createQuizz(quizz: Quizz): Promise<void>{
    //adds a quizz
    return this.firestore.collection('/quizzies').add(
      {
        nb_players: quizz.nb_players,
        max_score: quizz.max_score,
      }
    )
      //adds that quizz's questions
      .then(
      (quizz_doc_ref) => {
        quizz.questions.forEach((question) => {
          quizz_doc_ref.collection(`questions`).add(
            {
              text: question.text,
              correctAnswerId: question.correctAnswerId
            }
          )
            //for each question, adds its answers
            .then(
            (question_doc_ref) => {
              question.answers.forEach((answer) => {
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
    return this.firestore.doc(`quizzies/${quizz_id}`).set({
        nb_players: quizz.nb_players,
        max_score: quizz.max_score,
      }
    )
      //adds that quizz's questions
      .then(
        () => {
          quizz.questions.forEach((question) => {
            this.firestore.collection(`quizzies/${quizz_id}/questions`).add(
              {
                text: question.text,
                correctAnswerId: question.correctAnswerId
              }
            )
              //for each question, adds its answers
              .then(
                (question_doc_ref) => {
                  question.answers.forEach((answer) => {
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
    this.removeAllQuestionsFromQuizz(quizz_id);
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

  addQuestionToQuizz(question: Question, quizz_id: string) : Promise<void> {
    return this.firestore.collection(`quizzies/${quizz_id}/questions`).add({
      text: question.text,
      correctAnswerId: question.correctAnswerId
    })
      .then((question_doc_ref) => {
        question.answers.forEach((answer) => {
          question_doc_ref.collection('answers').add({
            text: answer.text,
            imageUrl: answer.imageUrl
          });
        });
      });
  }

  addQuestionToQuizzById(question: Question, question_id: string, quizz_id: string): Promise<void>{
    return this.firestore.doc(`quizzies/${quizz_id}/questions/${question_id}`).set({
      text: question.text,
      correctAnswerId: question.correctAnswerId
    })
      .then(() => {
        question.answers.forEach((answer) => {
          this.firestore.collection(`quizzies/${quizz_id}/questions/${question_id}/answers`).add({
            text: answer.text,
            imageUrl: answer.imageUrl
          });
        });
      });
  }

  removeQuestionFromQuizz(question_id: string, quizz_id: string): Promise<void>{
    this.removeAllAnswersFromQuestion(question_id, quizz_id);
    return this.firestore.doc(`quizzies/${quizz_id}/questions/${question_id}`).delete();
  }

  modifyQuestionOfQuizz(question: Question, question_id: string, quizz_id: string): Promise<void> {
    return this.removeQuestionFromQuizz(question_id, quizz_id)
      .then(() => {
        this.addQuestionToQuizzById(question, question_id, quizz_id).then(() => {
          //modification done
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

  retrieveAnswersFromQuestion(question_id: string, quizz_id: string): Promise<Answer[]>{
    let tab_answers: Answer[] = [];

    return new Promise((resolve) => {
      this.firestore.collection(`quizzies/${quizz_id}/questions/${question_id}/answers`).get()
      .subscribe(answers => {
        answers.forEach((answer) => {
          // @ts-ignore
          tab_answers.push(new Answer(answer.id, answer.data().text, answer.data().imageUrl));
        })
      });
      resolve(tab_answers);
    });

  }

  retrieveQuestionsFromQuizz(quizz_id: string): Promise<Question[]> {
    let tab_questions: Question[] = [];

    return new Promise((resolve) => {
      this.firestore.collection(`quizzies/${quizz_id}/questions`).get()
      .subscribe(
        questions => {
        questions.forEach(question => {
          this.retrieveAnswersFromQuestion(question.id, quizz_id)

            .then((retrieved_answers) => {
              // @ts-ignore
              tab_questions.push(new Question(question.id, question.data().text, retrieved_answers, question.data().correctAnswerId));
            });
        });
      },
        () => {},
        () => {resolve(tab_questions);}
      );
    });
  }

  // @ts-ignore
  retrieveQuizzById(quizz_id: string): Promise<Quizz>{
    let tab_questions: Question[];
    let quizz: Quizz;

    return new Promise((resolve) => {
      this.retrieveQuestionsFromQuizz(quizz_id)
        .then((retrieved_questions) => {
          tab_questions = retrieved_questions;
        })

        .then(() => {
          this.firestore.doc(`quizzies/${quizz_id}`)
            .get()
            .subscribe(
              (retrieved_quizz) => {
              quizz = new Quizz(
                retrieved_quizz.id,
                //@ts-ignore
                retrieved_quizz.data().nb_players,
                //@ts-ignore
                retrieved_quizz.data().max_score,
                tab_questions);
            },
              () => {},
              () => {resolve(quizz)});
        })
    });
  }

  removeAllAnswersFromQuestion(question_id: string, quizz_id: string): void{
    this.firestore.collection(`quizzies/${quizz_id}/questions/${question_id}/answers`).get()
      .subscribe(
        (answers) => {
          answers.forEach((answer) => {
            this.removeAnswerFromQuestion(answer.id, question_id, quizz_id);
          });
        }
      );
  }

  removeAllQuestionsFromQuizz(quizz_id: string): void{
    this.firestore.collection(`quizzies/${quizz_id}/questions`).get()
      .subscribe((questions) => {
        questions.forEach((question) => {
            this.removeAllAnswersFromQuestion(question.id, quizz_id);
            this.removeQuestionFromQuizz(question.id, quizz_id);
        });
      }
      );
  }
}
