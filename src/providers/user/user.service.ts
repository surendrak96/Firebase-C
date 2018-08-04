import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp } from 'angularfire2';
import { FirebaseAuthState } from 'angularfire2/auth';
import { User } from '../../models/user.model'; // importa a classe de User que compõe o formulário
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs';
// import { FirebaseApp } from 'angularfire2/tokens';
// import { FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class UserService extends BaseService{

  users: FirebaseListObservable<User[]>;    //attribute array of users of type (model) User
  currentUser: FirebaseObjectObservable<User>;

  constructor(
    public af: AngularFire,

    @Inject(FirebaseApp) public firebaseApp: any,
    public http: Http,
  ) {
    super();
    // this.users = this.af.database.list(`/users`);
    this.listenAuthState();
  }

  private listenAuthState(): void {
    this.af.auth.subscribe((authState: FirebaseAuthState) => {
      if(authState) {
        this.currentUser = this.af.database.object(`/users/${authState.auth.uid}`);
        this.setUsers(authState.auth.uid)
        // current user
      }
    });
  }

  private setUsers(uidToExclude: string): void {
    this.users = <FirebaseListObservable<User[]>> this.af.database.list(`/users`, {
      query: {
        orderByChild: 'name'   //order by name
      }
    }).map((users: User[]) => { //filter
      return users.filter((user: User) => user.$key !== uidToExclude);
        // will only catch users who do not have the same id as the current user (uid to exclude0)

    })
  }

  create(user: User, userUniqueId: string,  ): firebase.Promise<void> {
      // The create function has the user parameter of type User (folder models) and returns a firebase.promise EMPTY (void)
         // return this.users.push (user); // the users attribute is a listing of the '/ users' node. The push method is to add

         // If the path does not exist (from the parameter below), it will set (.set ()) the user in that path (not to duplicate)
       return this.af.database.object(`/users/${userUniqueId}`)

      .set(user)
      .catch(this.handlePromiseError);

  }

  edit(user: {name: string, username: string, photo: string}): firebase.Promise<void> {
    return this.currentUser
      .update(user)
      .catch(this.handlePromiseError)
  }

  userExists(username: string): Observable<boolean> {
    return this.af.database.list(`/users`, {
      query: {
        orderByChild: 'username', // sort by 'username' attribute
        equalTo: username // that is equal to the username passed
      }
    }).map((users: User[]) => { // return is an array of type User
      return users.length > 0;  //  if the users array is greater than 0, it returns TRUE, if not, FALSE
    }).catch(this.handleObservableError);  // Error handling with BaseService handleObservableError method

    // return null;
  }

  emailAlreadyInUse(email: string): Observable<boolean> {
    return this.af.database.list(`/users`, {
      query: {
        orderByChild: 'email', // sorts the 'username' attribute of each node
        equalTo: email //that is equal to the last username
      }
    }).map((users: User[]) => {// return is an array of type User
      return users.length > 0;   // if the users array is greater than 0, it returns TRUE, if not, FALSE
    }).catch(this.handleObservableError); // Error handling with BaseService handleObservableError method
    // return null;
  }

  getUser(userId: string): FirebaseObjectObservable<User> {
    return <FirebaseObjectObservable<User>>this.af.database.object(`/users/${userId}`)
      .catch(this.handleObservableError);
  }

  uploadPhoto (photoFile: File, userId: string): firebase.storage.UploadTask {
         // I could get the userId by this.currentUser. $ key
         return this.firebaseApp
           .storage ()
           .ref () // if left here it would store in root
           .child (`/users/${userId}`) // stores in the users node with the key userId
           .put (photoFile); // the parameter is the file that will be stored
       }


}
