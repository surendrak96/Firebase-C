import { Component } from '@angular/core';
import { Platform } from 'ionic-angular/umd';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseAuthState } from 'angularfire2';

import { AuthService } from '../providers/auth/auth.service';
import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { User } from '../models/user.model';
import { UserService } from '../providers/user/user.service';

// import { FirebaseAuthState } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = SigninPage;
  currentUser: User;

  constructor(
    authService: AuthService,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    userService: UserService,

  ) {
  // this.initializeApp();
    authService.auth.subscribe((authState: FirebaseAuthState) => {
      if (authState) {
        this.rootPage = HomePage;
        userService.currentUser.subscribe((user: User) => {
          this.currentUser = user;
          // receives the user who is currently logged in

          console.log(this.currentUser);
          this.initializeApp();


        })
      } else {
        this.rootPage = SigninPage;
      }
    })

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });


  }


  initializeApp() {


      // Optional OneSignal code for iOS to prompt users later
      // Set your iOS Settings
      var iosSettings = {};
      iosSettings["kOSSettingsKeyAutoPrompt"] = false; // will not prompt users when start app 1st time
      iosSettings["kOSSettingsKeyInAppLaunchURL"] = false; // false opens safari with Launch URL

      // OneSignal Code start:
      // Enable to debug issues.
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        if (jsonData.notification.payload.additionalData != null) {
          console.log("Here we access addtional data");
          if (jsonData.notification.payload.additionalData.openURL != null) {
            console.log("Here we access the openURL sent in the notification data");

          }
        }
      };

      window["plugins"].OneSignal
        .startInit("e150b046-7a0a-4888-8b3b-3fb8dd39f53e")
        .iOSSettings(iosSettings) // only needed if added Optional OneSignal code for iOS above
        .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

    }

  }


