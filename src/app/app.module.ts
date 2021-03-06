import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateQuizzComponent } from './create-quizz/create-quizz.component';
import { EditQuizzComponent } from './edit-quizz/edit-quizz.component';
import { QuizzComponent } from './quizz/quizz.component';
import { FourOFourComponent } from './four-o-four/four-o-four.component';
import {RouterModule} from "@angular/router";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {QuestionsService} from "./services/questions.service";
import { FooterComponent } from './footer/footer.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

const appRoutes = [
  {path: '', component:CreateQuizzComponent},
  {path: 'create-quizz', component: CreateQuizzComponent},
  {path: 'edit-quizz/:id', component: EditQuizzComponent},
  {path: 'quizz/:id', component: QuizzComponent},
  {path: '**', component: FourOFourComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CreateQuizzComponent,
    EditQuizzComponent,
    QuizzComponent,
    FourOFourComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    QuestionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
