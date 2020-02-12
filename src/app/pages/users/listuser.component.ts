import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Router } from '@angular/router'
import { trigger, state, transition, animate, style } from '@angular/animations';
import { DataService } from '../../_services/share-data.service';

import { User } from '../../Authentication/_models';
import { UserService, AuthenticationService } from '../../Authentication/_services';
import { first } from 'rxjs/operators';
import { ExportService } from '../../_services/export.service';
import { FormGroup, Validators, FormBuilder, FormControl, MinLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { variable } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-listuser',
  moduleId: module.id,
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: '1',
        //display: 'block'
      })),
      state('closed', style({
        height: '0px',
        opacity: '0',
        //display: 'none'
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
export class ListuserComponent implements OnInit {
  private showDrop = false; 
  p: number = 1;
  private itemsPerPage = 20;
  public listUser = [];
  listPositionUsers = this.dataService.listPositionUsers;
  listPosition = this.dataService.listPositionUsers;
  listStatusUsers = this.dataService.listStatusUsers;
  listStatus = this.dataService.listStatusUsers;
  private classStatus;
  private Year;
  private name = true;
  private nameUsersDelete; private idUsersDelete;
  private inputSearch;
  private btnDeleteSearch;
  private isOpen = true;

  private stt = true; Id = true; Fullname = true; Email = true; Position = true; Status = true; Password = true; action = true;
  AddForm: FormGroup; UpdateUsersForm: FormGroup; DetailUsersForm: FormGroup; Validate; 
  loading = false;  submitted = false;
  users: User[];

  private user;
  order: string = 'Name';
  reverse: boolean = false;
  sortedCollection: any[];
  @ViewChild('closebutton', { static: false }) closeButtonCreate: ElementRef;
  @ViewChild('btnCloseConfirm', { static: false }) btnCloseConfirm: ElementRef;
  @ViewChild('closebuttonUpdate',{static:false}) closeButtonUpdate: ElementRef;

  myFilter: any =  {};
  constructor(private orderPipe: OrderPipe, private _router: Router, private userService: UserService,private dataService: DataService, private exportService: ExportService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.sortedCollection = orderPipe.transform(this.listUser, this.order);

  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
  private test;
  ngOnInit() {
    this.inputSearch = <HTMLElement>document.getElementsByClassName('input-search')[0];
    this.btnDeleteSearch = <HTMLElement>document.getElementsByClassName('icon-delete-search')[0];
    this.userService.getUsers().pipe(first()).subscribe(data => {
      this.listUser = data.body;
    });

    //Validate:
    var y = new Date();
    this.Year = y.getFullYear();
    
    this.AddForm = this.formBuilder.group({
      FullName: ['', [
        Validators.maxLength(255),
        Validators.minLength(1),
        Validators.required
      ]],
      Password: ['', [
        Validators.maxLength(255),
        Validators.minLength(1),
        Validators.required
      ]],
      Email: ['', [
        Validators.maxLength(255),
        Validators.minLength(1),
        Validators.email,
        Validators.required
      
      ]],
      Position: ['', [
        Validators.maxLength(10),
        Validators.minLength(1),
        Validators.required
      ]]
    });
    this.UpdateUsersForm = this.formBuilder.group({
      Id: ['', [
        Validators.required
      ]],
      FullName: ['', [
        Validators.maxLength(255),
        Validators.minLength(1),
        Validators.required
      ]],
      Password: ['', [
        Validators.maxLength(30),
        Validators.minLength(6),

        Validators.required
      ]],
      Email: ['', [
        Validators.maxLength(255),
        Validators.minLength(1),
        Validators.email,
        Validators.required
      
      ]],
      Position: ['', [
        Validators.maxLength(10),
        Validators.minLength(1),
        Validators.required
      
      ]]
    });
    this.DetailUsersForm = this.formBuilder.group({
      Id: [{ disable: true }],
      FullName: [{ disable: true }],
      Email: [{ disable: true }],
      linkcv: [{ disable: true }],
      Position: [{ disable: true }],
      Status: [{ disable: true }],
    });
  }

  get f() { return this.AddForm.controls; }
  get u() { return this.UpdateUsersForm.controls; }
  get d() { return this.DetailUsersForm.controls; }

  //Confirm truoc khi xoa:
  getInfoUsersDelete(name, id) {
    this.nameUsersDelete = name;
    this.idUsersDelete = id;
  }

  //Delete user:
  deleteUsers(Id) {
    if(Id == 0){
      this.toastr.success("Không thể xóa tài khoản ADMIN.", "Không thành công!", {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        easing: 'ease-in',
        closeButton: false
      })
      return;
    }
    this.loading = true;
    this.userService.deleteUsers(Id)
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            //Update success:
            this.btnCloseConfirm.nativeElement.click();
            this.reloadDataAfterSubmit();
            this.toastr.success("Đã xóa thông tin người dùng.", "Thành công!", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              easing: 'ease-in',
              closeButton: false
            })
            this.loading = false;
          }
        },
        error => {
          //Errors
        });
  }

  //Re-get listUser:
  reloadDataAfterSubmit() {
    this.userService.getUsers().pipe(first()).subscribe(response => {
      this.listUser = response.body;
    });
  }

  reloadComponent() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['/danh-sach-user']);
  }
  export() {
    this.exportService.exportExcel(this.listUser, 'DanhSachUser');
  }

  //Show user
  showDetailUser(Id) {
    var filteredArray = this.listUser.filter(function (item) {
      return item.Id == Id;
    });
    let itemArray = filteredArray[0];
    this.d.Id.setValue(itemArray.Id);
    this.d.FullName.setValue(itemArray.FullName);
    this.d.Email.setValue(itemArray.Email);
    this.d.Position.setValue(itemArray.Position);
    this.d.Status.setValue(itemArray.Status == 1 ? "Hoạt động" : "Không hoạt động");
  }
  showEditUser(Id) {
    var filteredArray = this.listUser.filter(function (item) {
      return item.Id == Id;
    });
    let itemArray = filteredArray[0];
    this.u.Id.setValue(itemArray.Id);
    this.u.FullName.setValue(itemArray.FullName);
    this.u.Password.setValue(itemArray.Password);
    this.u.Email.setValue(itemArray.Email);
    this.u.Position.setValue(itemArray.Position);
  }
  onReset() {
    this.submitted = false;
    this.AddForm.reset();
  }
  //Event add Users:
  onSubmitAddUsers() {
    this.submitted = true;
    // Stop here if form is invalid
    if (this.AddForm.invalid) {
      console.log("Form invalid!");
      return;
    }
    this.loading = true;
    
    var FullName = this.f.FullName.value;
    var Password = this.f.Password.value;
    var Email = this.f.Email.value;
    var Position = this.f.Position.value;
    console.log(FullName + Password + Email + Position)
    this.userService.createUsers( FullName, Password, Email, Position )
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            //Create success:
            this.reloadDataAfterSubmit();
            this.AddForm.reset();
            this.closeButtonCreate.nativeElement.click();
            this.toastr.success("Đã thêm mới Users.", "Thành công!", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              easing: 'ease-in',
              closeButton: false
            })
            this.loading = false;
          }
        },
        error => {
          //Create error:
          this.toastr.warning("Vui lòng kiểm tra lại thông tin!","Đã tồn tại Email!", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton: false
          })
        });
  }
  onSubmitUpdateUsers(){
    this.submitted = true;
    // Stop here if form is invalid
    if (this.UpdateUsersForm.invalid) {
        console.log("Form invalid!");
        return;
    }
    var Id = this.u.Id.value;
    var FullName = this.u.FullName.value;
    var Password = (this.u.Password.value);
    var Email = (this.u.Email.value);
    var Position = this.u.Position.value;
  
    

    console.log("Id:" + Id + " Name:" + FullName + " Max:" + Password + " Pass:" + Email + " Status:" + Position);

    this.userService.updateUsers(Id, FullName, Password, Email, Position)
        .pipe(first())
        .subscribe(
            response => {
                console.log("Code = " + response.status + " Message = " + response.body);
                if(response.status == 200 && response.body != null){
                    //Update success:
                    this.reloadDataAfterSubmit();

                    // let updateItem = this.listStudent.filter(i => i.Id === saveStudent.Id);
                    // let index = this.listStudent.indexOf(updateItem[0]);
                    // this.listStudent[index] = saveStudent;
                    
                    this.closeButtonUpdate.nativeElement.click();
                    this.toastr.success("Đã sửa thông tin người dùng.", "Thành công!",{
                        timeOut: 3000,
                        positionClass: 'toast-top-right',
                        easing: 'ease-in',
                        closeButton : false
                    })
                    this.loading = false;
                }
            },
            error => {
                //Update error:
                this.toastr.warning("Vui lòng kiểm tra lại thông tin!", "Đã tồn tại Email!",{
                    timeOut: 3000,
                    positionClass: 'toast-top-right',
                    easing: 'ease-in',
                    closeButton : false
                })
            });
}
showBtnDelete() {
  if (this.inputSearch.value) {
    this.btnDeleteSearch.classList.remove('d-none');
  } else {
    this.btnDeleteSearch.classList.add('d-none');
  }
}
deleteSearch() {
  this.inputSearch.value = "";
  this.btnDeleteSearch.classList.add('d-none');
  this.reloadComponent();
}
badgePositionUsers(position){
  return this.dataService.badgePositionUsers(position);
}
badgeStatusUsers(status){
  return this.dataService.badgeStatusUsers(status);
}


}
