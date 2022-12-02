import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PeopleComponent } from "./people/people/people.component";

const routes: Routes = [
  { path: 'people', component: PeopleComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
