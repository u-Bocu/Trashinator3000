import { Component } from '@angular/core';
import {Md5} from 'ts-md5';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

hidePassword = true;
md5HashedPassword : string = "";

form = this.fb.group({
  username : ['', Validators.required],
  password : ['', Validators.required]
})

constructor(
  private fb : FormBuilder,
  private authService: AuthService
) {}

Login(): void
{
  this.md5HashedPassword = Md5.hashStr(this.form.value.password!);

  this.authService.Login(this.form.value.username!, this.md5HashedPassword)
    .subscribe(response => {
        console.log(response);
        alert(response.message)

        if(response.sucess == "false")
        {
          this.form.value.password = ""  
        }
    });
  }
}

