// import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AlertController, App, MenuController, NavController } from 'ionic-angular/umd';
import { AuthService } from '../providers/auth/auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SigninPage } from '../pages/signin/signin';
// import { App } from 'ionic-angular/components/app/app';
// import { MenuController } from 'ionic-angular/components/app/menu-controller';

export abstract class baseComponent implements OnInit{

    protected navCtrl: NavController;

 
    /*  You can use this component within a menu or page header
         Well, take the current navigation (ngOnInit) */

    constructor(
        public alertCtrl: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
    ) {}

    ngOnInit(): void {
       // this.navCtrl = this.app.getActiveNav(); // receives the used navController
       this.navCtrl = this.app.getActiveNavs()[0];
    }

    onLogOut(): void {
        this.alertCtrl.create({
            message: "Do you wanna quit?",
            buttons: [
                {
                    text: "Yes",
                    handler: () => {                // if you click YES (you want to exit)
                        this.authService.logOut()
                            .then( () => {
                                this.navCtrl.setRoot(SigninPage);
                                this.menuCtrl.enable(false, 'user-menu');
                            })
                    }
                },
                {text: "No"}
            ]
        }).present(); // show the alert
    }

}