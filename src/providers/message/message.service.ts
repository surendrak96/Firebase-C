import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { BaseService } from '../base/base.service';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { Message } from '../../models/message.model'

@Injectable()
export class MessageService extends BaseService{

  constructor(
    public http: Http,
    public af: AngularFire,
  ) {
    super();
  }

  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>>this.af.database.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timeStamp',
        limitToLast: 30 // limits to get the last 30 messages
      }
    }).catch(this.handleObservableError);
  }

  setMessageRead(userId1: string, userId2: string, messageId: string): void {
    // this.af.database.list(`/messages/${userId1}-${userId2}/${messageId}`)
    this.af.database.list(`/messages/${userId1}-${userId2}`)
      .update(messageId, {
        read: true
      }
    )

  }

  create(message: Message, listMessages: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return listMessages.push(message)
      .catch(this.handlePromiseError);
  }

}
