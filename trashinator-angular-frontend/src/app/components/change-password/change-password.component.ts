import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService  } from 'ngx-toastr';
import {Md5} from 'ts-md5';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

 token: string = "";

  constructor(private route: ActivatedRoute, private fb : FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService)
  {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
        console.log(this.token)
    });
  }

isValid : boolean = false;
patternPassword = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$";

md5HashedPassword : string = "";

hidePassword = true;
hideConfirmPassword = true;

form = this.fb.group({
  password : ['', Validators.required],
  confirmPassword : ['', Validators.required]});
 
onSubmit()
{
  if(this.form.value.password != "" && this.form.value.confirmPassword != "")
{
    this.md5HashedPassword = Md5.hashStr(this.form.value.password!);
    this.authService.resetPassword(this.token, this.md5HashedPassword)
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
          if(this.isValid == false)
          {
            this.toastr.error(response.message, 'Erreur', {
              positionClass: 'test'
            });
          }
          else if(this.isValid == true)
          {
            this.toastr.success(response.message, 'Succès', {
              positionClass: 'test'
            });
          this.router.navigate(['/login']);
          }
        }
    })
}
}

}
