import { Component } from '@angular/core';
import {Md5} from 'ts-md5';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService  } from 'ngx-toastr';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

isValid : boolean = false;
patternUsername = "^[A-Za-z0-9_-]{4,15}$"
patternmailAddress = "^[a-zA-Z0-9-._]{1,64}@[a-zA-Z0-9-._]{1,64}.[a-zA-Z0-9]{1,3}";
patternPassword = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$";

md5HashedPassword : string = "";

hidePassword = true;
hideConfirmPassword = true;

form = this.fb.group({
  username : ['', Validators.required],
  mailAddress : ['', Validators.required],
  password : ['', Validators.required],
  confirmPassword : ['', Validators.required]});


constructor(
  private fb : FormBuilder,
  private authService: AuthService,
  private router: Router,
  private toastr: ToastrService,
) {}


signup(): void
{
  if(this.form.value.username != "" && this.form.value.password != "" && this.form.value.confirmPassword != "")
  {
      this.md5HashedPassword = Md5.hashStr(this.form.value.password!);
      this.authService.signup(this.form.value.username!, this.md5HashedPassword, this.form.value.mailAddress!)

      .subscribe(response =>
      {
          this.isValid = response.success

          if(this.form.value.password != this.form.value.confirmPassword)
          {
            this.toastr.error("Les mots de passe ne correspondent pas", 'Erreur', {
              positionClass: 'test'
            });
          }
          else
          {
            if(!this.isValid)
            {
              this.toastr.error(response.message, 'Erreur', {
                positionClass: 'test'
              });
              this.form.value.password = ""
            } else {
              this.toastr.success(response.message, 'Succès', {
                positionClass: 'test'
              });
            this.router.navigate(['/login']).then(r => r);
            }
          }
      })
  }
}
}
