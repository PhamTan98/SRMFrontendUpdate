import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Router } from '@angular/router'
import { ExportService } from '../../_services/export.service';
import { StudentsComponent } from '../students/students.component';
import { DataService } from '../../_services/share-data.service';
import { FilterPipe } from 'ngx-filter-pipe';
import {trigger, state, transition, animate, style } from '@angular/animations';
import { UserService, AuthenticationService } from '../../Authentication/_services';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'checkin-cmp',
    moduleId: module.id,
    templateUrl: 'check-in.component.html',
    styleUrls:['check-in.component.css'],
    animations:[
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

export class CheckInComponent implements OnInit{
    private inputSearch;
    private btnDeleteSearch;
    private itemsPerPage = 10;
    p: number = 1;
    order: string = 'Name';
    reverse: boolean = false;
    sortedCollection: any[];
    private isOpen = true;
    myFilter: any =  {FullName:'', Email:'', GPA:'', Status:'', IdSchool:'', IdLanguages:''};
    private viewOption ={
        STT :true, FullName :true, CV : true, Truong : true, Year : true, NgonNgu : true, Sex : true,
        GPA : true, Phone : true, Email : true, GhiChu : true, Status : true, Action : true, itemPerPage: this.itemsPerPage}
    id = true; checkin = true;

    private listStudent = [];
    listStatusCheckIn = this.dataService.listStatusCheckIn;
    listStatus = this.dataService.listStatusCheckIn;
    listSchool = [];
    listLanguage = [];
    listYear = this.dataService.listYear;
    listField = this.dataService.listFieldCheckInFake;
    listColumnStudentTable = this.dataService.listColumnStudentTable;
    
    constructor(private orderPipe: OrderPipe, private _router: Router, private userService: UserService,private exportService: ExportService, private dataService:DataService, private filterPipe: FilterPipe,private toastr:ToastrService) {
        this.sortedCollection = orderPipe.transform(this.listStudent, this.order);
    }
    ngOnInit(){
        this.userService.getSakuraSchoolLanguages().pipe(first()).subscribe(response=> {
            this.listSchool =  response.body["Schools"];
            this.listSchool.unshift({Id:'', FullName:'Tất cả'});

            this.listLanguage =  response.body["Languages"];
            this.listLanguage.unshift({Id:'', Name:'Tất cả'});
        })
        this.inputSearch = document.getElementById('searchInput');
        this.btnDeleteSearch = document.getElementById('icon-delete-search');
        this.userService.getListStudentByStatus('2').pipe(first()).subscribe(response=> {
            this.listStudent = response.body;
        });
        //ViewOption:
        var view = localStorage.getItem('viewOptionCheckIn')
        if(view){
            this.viewOption = JSON.parse(view);
            this.itemsPerPage = JSON.parse(view).itemPerPage;
        }
    }
    filterNotValue(collection, filterKey): any[] {  
        return collection.filter(i => i.value !== filterKey);
    }
    saveViewOptionToSession(){
        localStorage.setItem('viewOptionCheckIn', JSON.stringify(this.viewOption));
    }

    toggleByCheckBox(event){
        var id = event.target.id;
        var field = event.target.id.toString().split('id-')[1];
        if(event.target.checked == true){
            this.viewOption[field] = true;
            this.saveViewOptionToSession();
        }else{
            this.viewOption[field] = false;
            this.saveViewOptionToSession();
        }
    }
    saveItemPerPageToSession(itemPerPage:number){
        this.viewOption.itemPerPage = itemPerPage;
        this.saveViewOptionToSession();
    }

    toggleSearch(){
        this.isOpen = !this.isOpen;
    }
    setOrder(value: string) {
      if (this.order === value) {
        this.reverse = !this.reverse;
      }
      this.order = value;
    }
    
    showBtnDelete(){
        if(this.inputSearch.value){
            this.btnDeleteSearch.classList.remove('d-none');
        }else{
            this.btnDeleteSearch.classList.add('d-none');
        }    
    }
    deleteSearch(){
        this.inputSearch.value = "";
        this.btnDeleteSearch.classList.add('d-none');
        this.reloadComponent();
    }
    reloadComponent() {
        this._router.routeReuseStrategy.shouldReuseRoute = () => false;
        this._router.onSameUrlNavigation = 'reload';
        this._router.navigate(['/danh-sach-check-in']);
    }
    export(){
        this.exportService.exportExcel(this.listStudent, "DanhSachCheckIn");
    }
    badgeStatus(status){
        return this.dataService.badgeStatus(status);
    }
    updateStatusSinhVien(Id, Name, Status){
        this.userService.updateStatusStudent(Id, Status)
            .pipe(first())
            .subscribe(
                response => {
                    console.log("Code = " + response.status + " Message = " + response.body);
                    if(response.status == 200 && response.body != null){
                        //Update success:
                        this.reloadDataAfterSubmit();
                        this.toastr.success("Đã update trạng thái sinh viên "+Name+" thành "+Status+".", "Thành công!",{
                            timeOut: 3000,
                            positionClass: 'toast-top-right',
                            easing: 'ease-in',
                            closeButton : false
                        })
                    }
                },
                error => {
                    //Update error:

                });
    }
    //Reload listStudentApi:
    reloadDataAfterSubmit(){
        this.userService.getListStudentByStatus('2').pipe(first()).subscribe(response=> {
            this.listStudent = response.body;
        });
    }
}
