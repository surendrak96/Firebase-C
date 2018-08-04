import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { SigninPage } from './signin';

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninPage),
  ],
})
export class SigninPageModule {}
