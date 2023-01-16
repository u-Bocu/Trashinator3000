import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { WasteFormComponent } from "./components/waste-form/waste-form.component";
import { StatisticDashboardComponent } from "./components/statistic-dashboard/statistic-dashboard.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'waste-form', component: WasteFormComponent},
  { path: 'statistic-dashboard', component: StatisticDashboardComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
