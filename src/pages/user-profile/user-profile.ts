import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular/umd';

import { AuthService } from '../../providers/auth/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../providers/user/user.service';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  uploadProgress: number;
  private filePhoto: File;  // store the most current photo of the user (which is in the form)


  constructor(
    public authService: AuthService,
    public cd: ChangeDetectorRef,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {}

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.userService.currentUser
      .subscribe((user: User) => {
        this.currentUser = user;
      })
  }

  onSubmit(event: Event): void {
    event.preventDefault(); /// Do not refresh the page

    if (this.filePhoto) {
      let uploadTask = this.userService.uploadPhoto(this.filePhoto,this.currentUser.$key);

   // will hear the status change of this task (when completing)
          // the snapshot is a callback to access the current state of the upload
      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // divide the amount that has already been sent by the total and multiply by 100 to obtain the percentage
        this.cd.detectChanges();
       // detect the changes that occurred in the calculation to update the template
 
      }, (error: Error) => {  // callback error
        //catch error
      }, () => {  // callback when you finish uploading
        this.editUser(uploadTask.snapshot.downloadURL); // complete the url
      } )

    } else {
      this.editUser();  // / calls the private function
    }
  }

  onPhoto(event): void { 
    this.filePhoto = event.target.files[0]; //Since you are uploading only 1 photo, we use the index 0
  }

  private editUser(photoUrl?: string): void {
    this.userService.edit({
      name: this.currentUser.name,
      username: this.currentUser.username,
      photo: photoUrl  || this.currentUser.photo || ''
      // if you have received a new photo, put the new photo, if not, use the old one, if it is not already empty
    }).then(() => {
      this.canEdit = false; // close the form
      this.filePhoto = undefined; // resets the attribute
      this.uploadProgress = 0; // progress bar is 0%;
      this.cd.detectChanges();
    });
  }

}
