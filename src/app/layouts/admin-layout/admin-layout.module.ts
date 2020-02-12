import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { FilterPipeModule } from 'ngx-filter-pipe';
// import { FilterGreateThan } from '../../_pipe/myfilter.pipe';

import {FileUploadModule} from 'ng2-file-upload';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { TableComponent }           from '../../pages/table/table.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { UpgradeComponent }         from '../../pages/upgrade/upgrade.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { OrderModule } from 'ngx-order-pipe';


import { StudentsComponent }        from '../../pages/students/students.component';
import { CheckInComponent } from '../../pages/check-in/check-in.component';
import {ListTestComponent} from '../../pages/test/list-student-test/list-student-test.component';
import { ListBaiTestComponent } from 'app/pages/test/list-test/list-test.component';
import {ListuserComponent} from '../../pages/users/listuser.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    OrderModule,
    NgSelectModule,
    FilterPipeModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  declarations: [
    DashboardComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    StudentsComponent,
    CheckInComponent,
    ListTestComponent,
    ListBaiTestComponent,
    ListuserComponent
  ]
})

export class AdminLayoutModule {}
