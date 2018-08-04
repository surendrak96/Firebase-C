import { FormControl } from '@angular/forms';

export class emailValidator {

    static checkEmail(control: FormControl): any {

        return new Promise(resolve => {


            setTimeout(() => {
                if (control.value.toLowerCase() === "") {

                    resolve({
                        "username taken": true
                    });

                } else {
                    resolve(null);
                }
            }, 1000);

        });
    }

}