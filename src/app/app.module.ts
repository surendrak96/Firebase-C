import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular/umd';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule, AuthMethods, AuthProviders, FirebaseAppConfig } from 'angularfire2'; //importa o firebase app config

import { AuthService } from '../providers/auth/auth.service';
import { CapitalizePipe } from '../pipes/capitalize/capitalize';
import { ChatPage } from '../pages/chat/chat';
import { ChatService } from '../providers/chat/chat.service';
import { CustomLoggedHeaderComponent } from '../components/custom-logged-header/custom-logged-header.component';
import { HomePage } from '../pages/home/home';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { MessageService } from '../providers/message/message.service';
import { MyApp } from './app.component';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';
import { UserService } from '../providers/user/user.service';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { OneSignalPage } from '../pages/onesignal/onesignal';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyD6hBifmAuDZWHcjQch5MrTRv70e_cQrpo",
  authDomain: "fir-chat-c9b65.firebaseapp.com",
  databaseURL: "https://fir-chat-c9b65.firebaseio.com",
  storageBucket: "fir-chat-c9b65.appspot.com",
  // messagingSenderId: "717491479259"
};


const firebaseAuthConfig = {
  provider: AuthProviders.Custom,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    CapitalizePipe,
    ChatPage,
    CustomLoggedHeaderComponent,
    HomePage,
    MessageBoxComponent,
    MyApp,
    ProgressBarComponent,
    SigninPage,
    SignupPage,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage,
    OneSignalPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseAppConfig, firebaseAuthConfig),
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    HomePage,
    MyApp,
    SigninPage,
    SignupPage,
    UserProfilePage,
  OneSignalPage
  ],
  providers: [
    AuthService,
    ChatService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    MessageService,
  ]
})
export class AppModule {}
