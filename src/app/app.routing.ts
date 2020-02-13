import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {  LoginComponent } from './Authentication/_login/login.component';
import { StudentsComponent } from './pages/students/students.component';
import { CheckInComponent } from './pages/check-in/check-in.component';
import { ListTestComponent } from './pages/test/list-student-test/list-student-test.component';
import { ListBaiTestComponent } from './pages/test/list-test/list-test.component';
import { AuthGuard } from './Authentication/_helpers';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, 
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }

]},
  {
    path: '**',
    redirectTo: 'dashboard'
  },
  // {
  //       path: 'danh-sach-sinh-vien', component: StudentsComponent,
  //       children: [
  //           { path: 'danh-sach-check-in', component: CheckInComponent },
  //           {
  //               path: '',
  //               children: [
  //                   { path: 'list-test', component: ListTestComponent },
  //                   { path: 'list-bai-test', component: ListBaiTestComponent }
  //               ]
  //           }
  //       ],
  //   },
]
