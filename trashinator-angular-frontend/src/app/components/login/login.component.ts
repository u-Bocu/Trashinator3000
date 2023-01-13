import { Component } from '@angular/core';
import {Md5} from 'ts-md5';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
id : string = "";
password : string = "test";

constructor() {}

onSubmit(): void
{
  this.password = Md5.hashStr("Strinsdg")

  console.log(this.password)  
}






}
