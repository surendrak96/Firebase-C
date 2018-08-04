import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseAuthState, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { BaseService } from '../base/base.service';
import { Chat } from '../../models/chat.model';

@Injectable()
export class ChatService extends BaseService {

  chats: FirebaseListObservable<Chat[]>

  constructor(
    public af: AngularFire,
    public http: Http
  ) {
    super();
    this.setChats();
  }
  
  private setChats(): void {
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
       // if user is logged in
        if(authState) {
         // auth is the user's node (if any)
          this.chats = <FirebaseListObservable<Chat[]>>this.af.database.list(`/chats/${authState.auth.uid}`, {
            query: {
              orderByChild: 'timeStamp' // returns in GROWING order (q must be descending, ie the most recent message)
            }
          }).map((chats: Chat[]) => {
            return chats.reverse(); // reverse array order
          }).catch(this.handleObservableError);

        }
      })
  }

  create(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
    return this.af.database.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  // chats nodes are composed by the id of the 2 users
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat>{
    return <FirebaseObjectObservable<Chat>> this.af.database.object(`/chats/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

  updatePhoto(chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string): firebase.Promise<void> {
    if (chatPhoto != recipientUserPhoto) {
     // Then you have to update the chat photo.
      return chat.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError); 
    }
    return Promise.resolve();
  }

}
