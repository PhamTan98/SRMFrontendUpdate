import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Router } from '@angular/router';
import { FilterPipe } from 'ngx-filter-pipe';
import { MyCustomPipePipe } from '../../../_pipes/my-custom-pipe.pipe';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, Student } from '../../../Authentication/_models';
import { UserService, AuthenticationService } from '../../../Authentication/_services';
import { first, filter } from 'rxjs/operators';
import { ExportService } from '../../../_services/export.service';
import { DataService } from '../../../_services/share-data.service'
import { FormGroup, Validators, FormBuilder, FormControl, MinLengthValidator, FormArray } from '@angular/forms';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-list-test',
  templateUrl: './list-student-test.component.html',
  styleUrls: ['./list-student-test.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: '1',
      })),
      state('closed', style({
        height: '0px',
        opacity: '0',
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class ListTestComponent implements OnInit {
  @ViewChild('btnCloseConfirm', { static: false }) btnCloseConfirm: ElementRef;
  private idSakura = 4;
  private showDrop = false; loading = false;
  p: number = 1;
  private itemsPerPage = 20;
  private authenticationService: AuthenticationService;
  private Year;
  private isOpen = true; //show hide search div
  private basicSearch = false; private advancedSearch = true;
  submitted = false;
  private stt = true; ten = true; cv = true; truong = true; nam = true; ngonngu = true; gender = true;
  gpa = true; sdt = true; email = true; ghichu = true; trangthai = true; action = true;
  // private saveStudent: Student; 
  order: string = 'Name';
  reverse: boolean = false;
  private inputMinGPA;
  sortedCollection: any[];

  private listStudent = []; listStudentAfterFilter = [];
  listStatus = this.dataService.listStatus;

  listTest = [];
  listLanguage = [];
  listSakura = [];
  listColumnStudentTable = this.dataService.listColumnStudentTable;
  listField = this.dataService.listFieldStudentFake;
  private checkedId = false;

  private viewOption = {
    STT: true, FullName: true, CV: true, Truong: true, Year: true, NgonNgu: true, Sex: true,
    GPA: true, Phone: true, Email: true, GhiChu: true, Status: true, Action: true, itemPerPage: this.itemsPerPage
  }

  filter = '';
  myFilter: any = { FullName: '', Status: '' };
  constructor(private orderPipe: OrderPipe, private _router: Router, private userService: UserService, private exportService: ExportService, private formBuilder: FormBuilder, private filterPipe: FilterPipe, private dataService: DataService, private toastr: ToastrService) {
    this.sortedCollection = orderPipe.transform(this.StudentTest, this.order);
  }

  private StudentTest = [];
  private TestSubject = [];
  // private Test=[];
  ngOnInit() {
    this.userService.getSakuraSchoolLanguages().pipe(first()).subscribe(response => {
      this.listSakura = response.body["Sakuras"];
      this.listLanguage = response.body["Languages"];
      this.listLanguage.unshift({ Id: '', Name: 'Tất cả' });
    })
    this.userService.GetListStudentTests(this.idSakura).pipe(first()).subscribe(response => {
      this.StudentTest = response.body["students"];
      this.TestSubject = response.body["TestSubjects"];
      console.log(this.TestSubject);
    });
    this.userService.getListTest().pipe(first()).subscribe(response => {
      this.listTest = response.body;
    })
    //ViewOption:
    var view = localStorage.getItem('viewOptionStudenttest')
    if (view) {
      this.viewOption = JSON.parse(view);
      this.itemsPerPage = JSON.parse(view).itemPerPage;
    }
  }
  filterNotId(collection, filterKey): any[] {
    return collection.filter(i => i.Id !== filterKey);
  }
  reloadDataAfterSubmit() {
    this.userService.GetListStudentTests(this.idSakura).pipe(first()).subscribe(response => {
      this.StudentTest = response.body["students"];
    });
  }
  showBtnDel = false;
  showBtnDelete(event) {
    if (event.target.value) {
      this.showBtnDel = true;
    } else {
      this.showBtnDel = false;
    }
  }
  checkAll(event: any) {
  }

  deleteSearch(event) {
    this.showBtnDel = false;
    event.path[1].childNodes[0].value = "";
    //Gan lai array filter:
    this.filter = '';
  }
  filterNotLabel(collection, filterKey): any[] {
    return collection.filter(i => i.label !== filterKey);
  }
  toggleSearch() {
    this.isOpen = !this.isOpen;
  }
  toggleByCheckBox(event) {
    var id = event.target.id;
    var field = event.target.id.toString().split('id-')[1];
    if (event.target.checked == true) {
      this.viewOption[field] = true;
      this.saveViewOptionToSession();
    } else {
      this.viewOption[field] = false;
      this.saveViewOptionToSession();
    }
  }
  saveViewOptionToSession() {
    localStorage.setItem('viewOptionStudenttest', JSON.stringify(this.viewOption));
  }
  saveItemPerPageToSession(itemPerPage: number) {
    this.viewOption.itemPerPage = itemPerPage;
    this.saveViewOptionToSession();
  }
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
  //Phan loai:
  phanLoaiKetQua() {

  }
  GetListStudentBySakura() {
    this.userService.GetListStudentTests(this.idSakura).pipe(first()).subscribe(response => {
      this.StudentTest = response.body["students"];
    });
    console.log(this.idSakura)
  }

  //Check string ton tai trong list object(loai hinh test):
  checkExistArray(value, listObj: []) {
    for (let i = 0; i < listObj.length; i++) {
      if (value == listObj[i]["IdTestSubject"]) {
        return i;
      }
    }
    return -1;
  }

  //Check Status
  LabelForStatus(statusValue) {
    var status = { label: '', classStatus: '' };
    switch (statusValue) {
      case ' ': status.label = 'New'; status.classStatus = 'badge badge-info'; break;
      case '0': status.label = 'Loại'; status.classStatus = 'badge badge-success'; break;
      case '1': status.label = 'Gia nhập'; status.classStatus = 'badge badge-primary'; break;
      case '2': status.label = 'Check-in'; status.classStatus = 'badge badge-secondary'; break;
      case '3': status.label = 'Test'; status.classStatus = 'badge badge-warning'; break;
      case '4': status.label = 'Hẹn chế độ'; status.classStatus = 'badge badge-light'; break;
      // case '5':   status.label = 'Chưa checkin'; status.classStatus = 'badge badge-primary'; break;
      // case '6':   status.label = 'Từ chối'; status.classStatus = 'badge badge-secondary'; break;
      // case '7':   status.label = 'Đã gửi mail'; status.classStatus = 'badge badge-warning'; break;
      // case '8':   status.label = 'Đã xác nhận mail'; status.classStatus = 'badge badge-light';break;
    }
    return status;
  }

  private idBaiTest; nameBaiTest;
  getIdBaiTest(event) {
    this.idBaiTest = event.Id;
    this.nameBaiTest = event.Name;
  }
  addSinhVienToTest() {
    //Check neu chua chon bai test:
    if (this.idBaiTest == null) {
      this.toastr.warning("Chưa chọn bài test.", "Lỗi!", {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        easing: 'ease-in',
        closeButton: false
      })
      return;
    }

    var listStudentAddTest = [];
    var listInputCheck = <any>document.getElementsByClassName('input-choose-student');

    var choosedStudent = false;
    listInputCheck.forEach(input => {
      if (input.checked == true) {
        choosedStudent = true;
        var student = { id: input.dataset.id, fullname: input.dataset.fullname };
        listStudentAddTest.push(student);
      }
    })
    //Check neu chua chon sv:
    if (!choosedStudent) {
      this.toastr.warning("Chưa chọn sinh viên.", "Lỗi!", {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        easing: 'ease-in',
        closeButton: false
      })
      return;
    }
    console.log(listStudentAddTest);
    this.loading = true;
    var Tests = { Id: this.idBaiTest }
    this.userService.postSinhVienToTest(Tests, listStudentAddTest)
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            //Add success:
            this.reloadDataAfterSubmit();
            this.toastr.success(`Đã thêm ${listStudentAddTest.length} sinh viên vào bài test ${this.nameBaiTest}.`, "Thành công!", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              easing: 'ease-in',
              closeButton: false
            })
            this.loading = false;
          }
        },
        error => {
          //Add error:

        });
  }


  //Delete SinhVien khoi bai test
  private nameStudentDelete; private idStudentDelete;
  getInfoStudentDelete(name, id) {
    this.nameStudentDelete = name;
    this.idStudentDelete = id;
  }
  deleteSinhVien(Id) {
    this.loading = true;
    this.userService.deleteSinhVienInStatusTest(Id)
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            //Update success:
            this.btnCloseConfirm.nativeElement.click();
            this.reloadDataAfterSubmit();
            this.toastr.success("Đã hủy sinh viên.", "Thành công!", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              easing: 'ease-in',
              closeButton: false
            })
            this.loading = false;
          }
        },
        error => {
          //Update error:

        });
  }
}
