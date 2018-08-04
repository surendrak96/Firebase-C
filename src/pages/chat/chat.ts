import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams } from 'ionic-angular/umd';

import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { AuthService } from '../../providers/auth/auth.service';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../providers/chat/chat.service';
import { Message } from '../../models/message.model';
import { MessageService } from '../../providers/message/message.service';
import { User } from '../../models/user.model';
import { UserService } from '../../providers/user/user.service';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content; // get the ion-content instance of the page (to do the scroll)
  messages: FirebaseListObservable<Message[]>;
  pageTitle: string;
  sender: User;   // sender

  recipient: User; //recipient
// the 2 attributes below will be used to update the last message of the home view (used in the ionViewDidLoad guard)
  private chat1: FirebaseObjectObservable<Chat>;  //sender chat
  private chat2: FirebaseObjectObservable<Chat>;  //recipient chat

  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    public messageService: MessageService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {}

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad(): void {
    this.recipient = this.navParams.get('recipientUser'); //receive from home.ts
    this.pageTitle = this.recipient.name;
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User)=> {
        this.sender = currentUser;

       // take the chats for the sender and the recipient
       this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);
       this.chat2 = this.chatService.getDeepChat(this.recipient.$key,this.sender.$key);

      // update user's photo
       if (this.recipient.photo) {
         this.chat1
           .first()
           .subscribe((chat: Chat) => {
             this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
           })
       }
        

        let doSubscription = () => {
          this.messages.subscribe((messages: Message[]) => {
            this.scrollToBottom();
          })
        };

        let updateSenderReadMessage = () => {
          this.messages.subscribe((message: Message[]) => {
            message.filter((msg: Message) => {
              if ((msg.read == false || msg.read == undefined) && msg.userId != this.sender.$key) { // DEPOIS EXPLICO A GAMBIARRA
                this.messageService.setMessageRead(this.sender.$key, this.recipient.$key, msg.$key);
              }
            })
          });
        }

        let updateRecipientReadMessage = () => {
          this.messages.subscribe((message: Message[]) => {
            message.filter((msg: Message) => {
              if ((msg.read == false || msg.read == undefined) && msg.userId != this.sender.$key) { // DEPOIS EXPLICO A GAMBIARRA
                this.messageService.setMessageRead(this.recipient.$key, this.sender.$key, msg.$key);
              }
            })
          });
        }

          // search for chat messages: (have to see if the user order is right
       // sometimes the sender (id 1) in vdd is the recipient (id 2) and vice versa
        this.messages = this.messageService.getMessages(this.sender.$key, this.recipient.$key);
       // check if there is any message in this type of chat
        this.messages
          .first()
          .subscribe((messageList: Message[]) => {

            if (messageList.length === 0) { // if there is no such message
           // make the search with the ID's changed order
              this.messages = this.messageService.getMessages(this.recipient.$key, this.sender.$key);
              updateRecipientReadMessage();
            } else {
             // if the chat Node is the first sender ID of the sender
              updateSenderReadMessage();
            }
            doSubscription();
            
          })
    });
  }

  sendMessage(newMessage: string): void {
    if (newMessage) {
      let currentTimeStamp: Object = firebase.database.ServerValue.TIMESTAMP;
      this.messageService
      .create(  // create method parameters
        new Message (this.sender.$key, newMessage, currentTimeStamp, false),
        this.messages
      ).then(() => {
       //update last message and timestamp of 2 cheats
        this.chat1
          .update({
            lastMessage: newMessage,
            timeStamp: currentTimeStamp
          });
        this.chat2
          .update({
            lastMessage: newMessage,
            timeStamp: currentTimeStamp
          });
      })
    
    }
  }

   // optional animation duration parameter
  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content) { // if you have already loaded this.content (do not be undefined)
        this.content.scrollToBottom(duration || 300);
      }
    }, 50)
    
  }

}
