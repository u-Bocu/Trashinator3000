import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { WasteFormComponent } from "./components/waste-form/waste-form.component";
import { StatisticDashboardComponent } from "./components/statistic-dashboard/statistic-dashboard.component";
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {EditoComponent} from "./components/edito/edito.component";
import { ShopComponent } from './components/shop/shop.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'waste-form', component: WasteFormComponent},
  { path: 'statistic-dashboard', component: StatisticDashboardComponent },
  { path: 'login', component: LoginComponent},
  { path: 'sign-up', component: SignupComponent},
  { path: 'forgot-password', component: ForgetPasswordComponent},
  { path: 'reset-password', component: ChangePasswordComponent},
  { path: 'edito', component: EditoComponent },
  { path: 'boutique', component: ShopComponent},
  { path: '**', component: EditoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
