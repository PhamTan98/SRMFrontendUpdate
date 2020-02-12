import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';

import { StudentsComponent } from '../../pages/students/students.component';
import { CheckInComponent } from '../../pages/check-in/check-in.component';
import { AuthGuard } from '../../Authentication/_helpers/auth.guard';
import { ListTestComponent } from 'app/pages/test/list-student-test/list-student-test.component';
import { ListBaiTestComponent } from 'app/pages/test/list-test/list-test.component';
import { ListuserComponent } from 'app/pages/users/listuser.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'table',          component: TableComponent, canActivate: [AuthGuard] },
    { path: 'typography',     component: TypographyComponent, canActivate: [AuthGuard] },
    { path: 'icons',          component: IconsComponent, canActivate: [AuthGuard] },
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    { path: 'upgrade',        component: UpgradeComponent, canActivate: [AuthGuard] },
    { path: 'danh-sach-sinh-vien',    component: StudentsComponent, canActivate: [AuthGuard] },
    { path: 'danh-sach-check-in',     component: CheckInComponent, canActivate: [AuthGuard] },
    { path: 'list-test',             component: ListTestComponent, canActivate: [AuthGuard]},
    { path: 'list-bai-test',     component: ListBaiTestComponent, canActivate: [AuthGuard]},
    { path: 'danh-sach-user',     component: ListuserComponent, canActivate: [AuthGuard]},
];

