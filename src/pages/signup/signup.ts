import { Component, OpaqueToken } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular/umd";
import { Loading } from "ionic-angular/components/loading/loading";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseAuthState } from "angularfire2";

import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { LoadingController } from "ionic-angular/components/loading/loading-controller";

import { AuthService } from "../../providers/auth/auth.service";
import { UserService } from "../../providers/user/user.service";
// import { User } from '../../models/user.model';

import { HomePage } from "../home/home";
 //import { emailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  signupForm: FormGroup; //FormGroup;
  checkingEmail: boolean = true;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {
    // let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.signupForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      username: ["", [Validators.required, Validators.minLength(3)]],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(emailRegex)
        ])
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],

      oneSignalID: ["",[Validators.required, Validators.minLength(3)]]

    });

  }

  onSubmit(): void {
    let loading: Loading = this.showLoading();

    let formUser = this.signupForm.value;

    let username: string = formUser.username;


    this.userService
      .userExists(username)
      .first()
      .subscribe((userExists: boolean) => {
         if (!userExists) {

          this.authService
            .createAuthUser({
                email: formUser.email,
                password: formUser.password,

            })
            .then((authState: FirebaseAuthState) => {
               delete formUser.password;


              let userUniqueId: string = authState.auth.uid;


              this.userService
                .create(formUser, userUniqueId)
                .then(() => {

                  loading.dismiss();
                  this.navCtrl.setRoot(HomePage);
                })
                .catch((error: any) => {
                  loading.dismiss();
                  this.showAlert(error);
                });
            })
            .catch((error: any) => {
              loading.dismiss();
              this.showAlert(error);
            });
        } else {
          this.showAlert("Username already in use! Pick another one.");
          loading.dismiss();
        }
      });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl
      .create({
        message: message,
        buttons: ["Ok"]
      })
      .present();
  }
}
