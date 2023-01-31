import {Component} from '@angular/core';
import {Md5} from 'ts-md5';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {LocalStorageService} from "../../services/local-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hidePassword = true;
  md5HashedPassword: string = "";
  isValid: boolean = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
  }

  public login(): void {
    if (this.form.value.password != "" && this.form.value.username) {
      this.md5HashedPassword = Md5.hashStr(this.form.value.password!);

      this.authService.login(this.form.value.username!, this.md5HashedPassword)
        .subscribe(response => {
          this.isValid = response.success

          if (!this.isValid) {
            this.toastr.error('Identifiant ou mot de passe invalide', 'Erreur', {
              positionClass: 'test'
            });
            this.localStorageService.deleteData();
          } else {
            this.toastr.success('Bienvenue ' + this.form.value.username!, 'Succès', {
              positionClass: 'test'
            });
            this.localStorageService.saveData('user_id', response.data[0]);
            this.localStorageService.saveData('username', response.data[1]);
            this.router.navigate(['/dashboard']).then(() => window.location.reload());
          }
        });
    }
  }
}

