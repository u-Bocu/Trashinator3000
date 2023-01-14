import { Component } from '@angular/core';
import {Md5} from 'ts-md5';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

md5HashedPassword : string = "";

hidePassword = true;
hideConfirmPassword = true;

form = this.fb.group({
  username : ['', Validators.required],
  password : ['', Validators.required],
  confirmPassword : ['', Validators.required]
})

constructor(
  private fb : FormBuilder,
  private authService: AuthService,
  private router: Router
) {}

Signup(): void
{
  //Need request from database to verify the identity
  //Too much code in there for a submit
  
  if(this.form.value.password == this.form.value.confirmPassword)
  {
    this.md5HashedPassword = Md5.hashStr(this.form.value.password!);
    this.authService.Signup(this.form.value.username!, this.md5HashedPassword)
      .subscribe(response => {
          console.log(response);
          alert(response.message)

          this.router.navigate(['/login'])
      });
  }
}

}
