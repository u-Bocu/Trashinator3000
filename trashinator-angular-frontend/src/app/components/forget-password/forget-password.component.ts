import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService  } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

patternmailAdress = "^[a-zA-Z0-9-._]{1,64}@[a-zA-Z0-9-._]{1,64}.[a-zA-Z0-9]{1,3}";

isValid = false;
form = this.fb.group({
  mailAdress : ['', Validators.required]
})

constructor(
  private fb : FormBuilder,
  private authService: AuthService,
  private toastr: ToastrService,
  private router: Router,
) {}

onSubmit(): void
{
  if(this.form.value.mailAdress != "")
  {
    this.authService.forgotPassword(this.form.value.mailAdress!)
      .subscribe(response => {

          this.isValid = response.success
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
      });
  }
}

}
