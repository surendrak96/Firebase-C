import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth, FirebaseAuthState } from 'angularfire2/auth';
import { BaseService } from '../base/base.service';
// import { Promise } from 'firebase';
import * as firebase from 'firebase';

@Injectable()
export class AuthService extends BaseService{

  constructor(
    public auth: AngularFireAuth,
    public http: Http
  ) {
    super();  // / (baseService)
  }

  createAuthUser(user: {email: string, password: string}): firebase.Promise<FirebaseAuthState> {
    // function with parameter user object, return a firebase promise of type firebaseauthstate
   // create an authentication user with the Angular Fire Auth service
 return this.auth.createUser(user)
      .catch(this.handlePromiseError);
  }
  signInWithEmail(user: {email: string, password: string}): firebase.Promise<boolean> {
    return this.auth.login(user)
      .then((authState: FirebaseAuthState) => {
        return authState != null; // returns true if authState is other than null (ie, logout)

      })
      .catch(this.handlePromiseError);
  }

  logOut(): Promise<void>{
    return this.auth.logout();
  }

  get authenticated(): Promise<boolean> {
        return new Promise((resolve, reject) => {
      this.auth
      .first()  // just get the first change
      .subscribe((authState: FirebaseAuthState) => {
        // (authState) ? resolve(true) : reject(false);   // if authState is true, returns true
        (authState) ? resolve(true) : reject(Error);   // if authState is true, returns true
      })
    })
  }

}
