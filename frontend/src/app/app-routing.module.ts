import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';

const routes: Routes = [
  { path: 'vehicles', component: VehicleListComponent },
  { path: '', redirectTo: '/vehicles', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
