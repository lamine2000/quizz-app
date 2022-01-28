import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateQuizzComponent } from './create-quizz/create-quizz.component';
import { ChallengeComponent } from './challenge/challenge.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateQuizzComponent,
    ChallengeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
