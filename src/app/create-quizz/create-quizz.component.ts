import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../services/questions.service';

@Component({
  selector: 'app-create-quizz',
  templateUrl: './create-quizz.component.html',
  styleUrls: ['./create-quizz.component.css']
})
export class CreateQuizzComponent implements OnInit {

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
  }

}
