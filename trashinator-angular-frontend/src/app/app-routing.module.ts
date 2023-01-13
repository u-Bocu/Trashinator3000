import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from './components/login/login.component';
import { WasteFormComponent } from "./components/waste-form/waste-form.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'waste-form', component: WasteFormComponent},
  { path: 'login-page', component: LoginComponent},
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
