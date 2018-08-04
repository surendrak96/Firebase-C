import { Component } from '@angular/core';
import { MenuController, NavController, Loading, LoadingController } from 'ionic-angular/umd';

import { FirebaseListObservable } from 'angularfire2/database';

import { AuthService } from '../../providers/auth/auth.service';
import { Chat } from '../../models/chat.model';
import { ChatPage } from '../chat/chat';
import { ChatService } from '../../providers/chat/chat.service';
import { SignupPage } from '../signup/signup';
import { User } from '../../models/user.model';
import { UserService } from '../../providers/user/user.service';

import firebase from 'firebase';
import { OneSignalPage } from '../oneSignal/onesignal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: FirebaseListObservable<User[]>;  // users attribute is an array of Users of type FireBase Observable

  chats: FirebaseListObservable<Chat[]>;
  view: string = 'chats';

  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public userService: UserService,  // injects the user service
  ) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {

    this.showLoading();

    this.chats = this.chatService.chats;
    this.users = this.userService.users;
    //the users attribute of this page is the same as the attribute of the user service
    this.menuCtrl.enable(true, 'user-menu');// enable the menu when entering the home page

  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  onChatCreate(recipientUser: User): void {

    this.userService.currentUser   //has to have the subscribe for being a promise and we are 'listening' to the changes
      .first()
      .subscribe((currentUser: User) => { // the current user is the current user
        this.chatService.getDeepChat(currentUser.$key,recipientUser.$key) //passes the users UID
          .first()
          .subscribe((chat: Chat) => {  // get a chat IF THERE'S in server

            if(chat.hasOwnProperty('$value')) {  // chat has its own property called '$ value'?
            // If you have, it does not exist
              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP; // take the timestamp from the server

              let chat1 = new Chat('',timestamp,recipientUser.name, (recipientUser.photo || '')); // take the timestamp from the server
              this.chatService.create(chat1,currentUser.$key,recipientUser.$key);

              let chat2 = new Chat('',timestamp,currentUser.name,(currentUser.photo || ''));
              this.chatService.create(chat2,recipientUser.$key,currentUser.$key);
            }

          });

      })
      this.navCtrl.push(ChatPage, {
        recipientUser: recipientUser  // sends the parameter that is the recipient of the message to the ChatPage page

      });
  }

  onChatOpen(chat: Chat): void {
    let recipientUserId: string = chat.$key; // receives the recipient user ID
    this.userService.getUser(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user  // sends the parameter that is the recipient of the message to the ChatPage page
        });
      });
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;
    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if (searchTerm) {
      switch(this.view) {

        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => {
              return chats.filter((chat: Chat) => {
                // play in small to not have error in comparison
                                 // if you return -1 there is no search term
                return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
              })
          })
          break;

        case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => {
              return users.filter((user: User) => {
                  // play in small to not have error in comparison
                                   // if you return -1 there is no search term
                return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
              })
          })
          break;
      }
    }
  }


  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 200
    });

    loading.present();

    return loading;
  }
  oneSignal(){
    this.navCtrl.push(OneSignalPage);
  }
}
