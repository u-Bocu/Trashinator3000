import { Component } from '@angular/core';
import {Md5} from 'ts-md5';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService  } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

hidePassword = true;
md5HashedPassword : string = "";
isValid : boolean = false;

form = this.fb.group({
  username : ['', Validators.required],
  password : ['', Validators.required]
})

constructor(
  private fb : FormBuilder,
  private authService: AuthService,
  private toastr: ToastrService,
) {}

Login(): void
{

  if(this.form.value.password != "" && this.form.value.username)
  {

    this.md5HashedPassword = Md5.hashStr(this.form.value.password!);

    this.authService.Login(this.form.value.username!, this.md5HashedPassword)
      .subscribe(response => {
          console.log(response.success);    

          this.isValid = response.success

          if(this.isValid == false)
          {
            this.toastr.error('Identifiant ou mot de passe invalide', 'Erreur', {
              positionClass: 'test'
            });
            this.form.value.password = ""  
          }
          else if(this.isValid == true)
          {
            this.toastr.success('Bienvenue username', 'Succès', {
              positionClass: 'test'
            });
          }
      });
    }
  }
}

