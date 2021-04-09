import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountViewDoctorComponent } from './account-view-doctor/account-view-doctor.component';
import { DoctorComponent } from './doctor.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { OfficeViewDoctorComponent } from './office-view-doctor/office-view-doctor.component';
import { PatientsViewComponent } from './patients-view/patients-view.component';

const routes: Routes = [
  {path: '', component: DoctorComponent, children: [
    {path: 'patients', component: PatientsViewComponent},
    {path: 'office', component: OfficeViewDoctorComponent},
    {path: 'account', component: AccountViewDoctorComponent},
    {path: 'doctors', component: DoctorsListComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
