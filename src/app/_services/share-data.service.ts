import { Injectable } from '@angular/core';
import { first, filter } from 'rxjs/operators';
import { UserService, AuthenticationService } from '../Authentication/_services';
import { element } from 'protractor';
import { NgLabelTemplateDirective } from '@ng-select/ng-select/lib/ng-templates.directive';

@Injectable({ providedIn: 'root' })

export class DataService{
    constructor() {       
    }
    listStatus = [
        { value: '', label: 'Tất cả' },
        { value: ' ', label: 'New' },
        { value: '0', label: 'Loại' },
        { value: '1', label: 'Gia nhập' },
        { value: '2', label: 'Check-in'},
        { value: '3', label: 'Test' },
        { value: '4', label: 'Hẹn chế độ' },
    ];
    badgeStatus(statusValue) {
        var status = {label:'', classStatus:''};
        switch (statusValue) {
            case ' ':   status.label = 'New'; status.classStatus = 'badge badge-info'; break;
            case '0':   status.label = 'Loại'; status.classStatus = 'badge badge-success'; break;
            case '1':   status.label = 'Gia nhập'; status.classStatus = 'badge badge-primary'; break;
            case '2':   status.label = 'Check-in'; status.classStatus = 'badge badge-secondary'; break;
            case '3':   status.label = 'Test'; status.classStatus = 'badge badge-warning'; break;
            case '4':   status.label = 'Hẹn chế độ'; status.classStatus = 'badge badge-light';break;
            case '5':   status.label = 'Chưa checkin'; status.classStatus = 'badge badge-primary'; break;
            case '6':   status.label = 'Từ chối'; status.classStatus = 'badge badge-secondary'; break;
            case '7':   status.label = 'Đã gửi mail'; status.classStatus = 'badge badge-warning'; break;
            case '8':   status.label = 'Đã xác nhận mail'; status.classStatus = 'badge badge-light';break;
        }
        return status;
    }
    listPositionUsers =[
        { value: '', label: 'Tất cả' },
        { value: '1', label: 'BU' },
        { value: '2', label: 'ME' },
        { value: '3', label: 'DT' },
        { value: '4', label: 'HR' },
        { value: '5', label: 'HC' },
        { value: '6', label: 'TT' },
        { value: '7', label: 'HV' },
        { value: '8', label: 'Null' },
    ];
    badgePositionUsers(PositionValue) {
        var position = {label:'', classPosition:''};
        switch (PositionValue) {
            case '0':   position.label = 'AD'; position.classPosition = 'badge badge-success'; break;
            case '1':   position.label = 'BU'; position.classPosition = 'badge badge-primary'; break;
            case '2':   position.label = 'ME'; position.classPosition = 'badge badge-secondary'; break;
            case '3':   position.label = 'DT'; position.classPosition = 'badge badge-warning'; break;
            case '4':   position.label = 'HR'; position.classPosition = 'badge badge-light';break;
            case '5':   position.label = 'HC'; position.classPosition = 'badge badge-primary'; break;
            case '6':   position.label = 'TT'; position.classPosition = 'badge badge-secondary'; break;
            case '7':   position.label = 'HV'; position.classPosition = 'badge badge-warning'; break;
            case '8':   position.label = 'Null'; position.classPosition = 'badge badge-light';break;
        }
        return position;
    }
    listStatusUsers =[
        { value: '', label: 'Tất Cả' },
        { value: '0', label: 'Không hoạt động' },
        { value: '1', label: 'Hoat động' },
    ];
    badgeStatusUsers(StatusValue) {
        var stautus = {label:'', classStatus:''};
        switch (StatusValue) {
            case '0':   stautus.label = 'Không hoạt động'; stautus.classStatus = 'badge badge-light'; break;
            case '1':   stautus.label = 'Hoạt động'; stautus.classStatus = 'badge badge-success'; break; 
        }
        return stautus;
    }
    listStatusCheckIn =[
        { value: '', label: 'Tất cả' },
        { value: '2', label: 'Check-in' },
        { value: '5', label: 'Chưa checkin' },
        { value: '6', label: 'Từ chối checkin' },
        { value: '7', label: 'Đã gửi mail offer' },
        { value: '8', label: 'Đã xác nhận mail' },
    ]
    listGPA = [
        { value: '0', label: 'Tất cả' },
        { value: '2.499', label: '< 2.5' },
        { value: '2.5', label: '>= 2.5' },
        { value: '3', label: '>= 3'},
        { value: '3.5', label: '>= 3.5' },
    ];
    listYear = [
        { value: '', label: 'Tất cả' },
        { value: '1', label: 'Năm 1' },
        { value: '2', label: 'Năm 2' },
        { value: '3', label: 'Năm 3'},
        { value: '4', label: 'Năm 4' },
        { value: '5', label: 'Năm 5' },
    ];
    listGender = [
        { value: '', label: 'Tất cả' },
        { value: '1', label: 'Nam' },
        { value: '0', label: 'Nữ' },
    ];
    listCertificate = [
        { value: '1', label: 'Có' },
        { value: '2', label: 'Không' },
        { value: '3', label: 'Có GPA' },
    ];
    listFieldStudentFake = [
        { value: '', label: 'Tất cả'},
        { value: 'STT', label: 'STT'},
        { value: 'FullName', label: 'Tên'},
        { value: 'CV', label: 'CV'},
        { value: 'Sex', label: 'Giới tính'},
        { value: 'NameSchool', label: 'Trường'},
        { value: 'Year', label: 'Năm thứ'},
        { value: 'NameLanguages', label: 'Ngôn ngữ'},
        { value: 'GPA', label: 'GPA'},
        { value: 'Phone', label: 'Phone'},
        { value: 'Email', label: 'Email'},
        { value: 'Details', label: 'Ghi chú'},
        { value: 'Status', label: 'Trạng thái'},
        { value: 'Action', label: 'Địa chỉ'},
    ];
    listColumnStudentTable = [
        { value: 'STT', label: 'STT'},
        { value: 'FullName', label: 'Họ tên'},
        { value: 'CV', label: 'Link CV'},
        { value: 'Sex', label: 'Giới tính'},
        { value: 'Truong', label: 'Trường'},
        { value: 'Year', label: 'Năm học'},
        { value: 'NgonNgu', label: 'Ngôn ngữ'},
        { value: 'GPA', label: 'GPA'},
        { value: 'Phone', label: 'SĐT'},
        { value: 'Email', label: 'Email'},
        { value: 'GhiChu', label: 'Ghi chú'},
        { value: 'Status', label: 'Trạng thái'},
        { value: 'Action', label: 'Action'},
    ]

    listFieldCheckInFake = [
        { value: '', label: 'Tất cả'},
        { value: 'Id', label: 'Id'},
        { value: 'FullName', label: 'Tên'},
        { value: 'Sex', label: 'Giới tính'},
        { value: 'Address', label: 'Địa chỉ'},
        { value: 'Email', label: 'Mail'},
        { value: 'Phone', label: 'SĐT'},
        { value: 'Year', label: 'Năm thứ'},
        { value: 'GPA', label: 'GPA'},
        { value: 'NameLanguages', label: 'Ngôn ngữ'},
        { value: 'Details', label: 'Ghi chú'},
        { value: 'Status', label: 'Trạng thái'},
        { value: 'NameSchool', label: 'Trường'},
    ]
   
}