import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { Router } from '@angular/router';
import { FilterPipe } from 'ngx-filter-pipe';
import { MyCustomPipePipe } from '../../_pipes/my-custom-pipe.pipe';

import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, Student, Id } from '../../Authentication/_models';
import { UserService, AuthenticationService } from '../../Authentication/_services';
import { first, filter } from 'rxjs/operators';
import { ExportService} from '../../_services/export.service';
import { DataService} from '../../_services/share-data.service'
import { FormGroup, Validators, FormBuilder, FormControl, MinLengthValidator, ValidatorFn } from '@angular/forms';
import {trigger, state, transition, animate, style } from '@angular/animations';

// const trimValidator: ValidatorFn = (control: FormControl) => {
//   if (control.value.startsWith(' ')) {
//     return {
//       'trimError': { value: 'control has leading whitespace' }
//     };
//   }
//   if (control.value.endsWith(' ')) {
//     return {
//       'trimError': { value: 'control has trailing whitespace' }
//     };
//   }
//   return null;
// };

@Component({
    selector: 'students-cmp',
    moduleId: module.id,
    templateUrl: 'students.component.html',
    styleUrls: ['students.component.css'],
    animations:[
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

export class StudentsComponent implements OnInit{
    // control = new FormControl('', trimValidator);
    private inputSearch;
    private showDrop = false; loading = false;
    p: number = 1; itemsPerPage = 20;
    private authenticationService : AuthenticationService;
    private Year;
    private isOpen = true; //show hide search div
    private basicSearch = false; private advancedSearch = true;
    
    private viewOption ={
        STT :true, FullName :true, CV : true, Truong : true, Year : true, NgonNgu : true, Sex : true,
        GPA : true, Phone : true, Email : true, GhiChu : true, Status : true, Action : true, itemPerPage : this.itemsPerPage}
        
    AddForm: FormGroup; UpdateStudentForm: FormGroup; DetailStudentForm: FormGroup; submitted = false;
    // private saveStudent: Student; 
    order: string = 'Name';
    reverse: boolean = false;
    private nameStudentDelete; private idStudentDelete;
    private inputMinGPA;
    sortedCollection: any[];

    private listStudent =  []; listStudentAfterFilter = [];
    
    listStatus = this.dataService.listStatus;
    listSchool = []; 
    listSakura = []; 
    listLanguage = [];
    listGPA = this.dataService.listGPA;
    listYear = this.dataService.listYear;
    listGender = this.dataService.listGender;
    listCertificate = this.dataService.listCertificate;
    
    listField = this.dataService.listFieldStudentFake;
    listColumnStudentTable = this.dataService.listColumnStudentTable;
    @ViewChild('closebutton',{static:false}) closeButtonCreate: ElementRef;
    @ViewChild('closebuttonUpdate',{static:false}) closeButtonUpdate: ElementRef;
    @ViewChild('btnCloseConfirm',{static:false}) btnCloseConfirm: ElementRef;
    @ViewChild('searchAdvanced',{static:false}) searchAdvanced: ElementRef;
    filter = '';

    myFilter: any =  {FullName:'', Email:'', GPA:'', Status:{$or:['']}, Year:{$or:['']}, IdLanguages:{$or:['']}, IdSchool:{$or:['']}, Sex:{$or:['']}};
    constructor(private orderPipe: OrderPipe, private _router: Router, private userService: UserService, private exportService: ExportService, private formBuilder: FormBuilder, private filterPipe: FilterPipe, private dataService: DataService, private toastr:ToastrService) {
        this.sortedCollection = orderPipe.transform(this.listStudent, this.order);
        //console.log( filterPipe.transform(this.listStudent, { FullName: '2Nguyen'}));
    }
    ngOnInit(){
        this.userService.getSakuraSchoolLanguages().pipe(first()).subscribe(response=> {
            this.listSakura =  response.body["Sakuras"];
            this.listSakura.unshift({Id:'', Name:'Tất cả'});

            this.listSchool =  response.body["Schools"];
            this.listSchool.unshift({Id:'', FullName:'Tất cả'});

            this.listLanguage =  response.body["Languages"];
        })

        this.inputSearch = document.getElementById('searchInputAdvanced');
        this.userService.getAll().pipe(first()).subscribe(response=> {
            this.listStudent = response.body;
            console.log(this.listStudent)
        });
        this.listStudentAfterFilter = this.filterPipe.transform( this.filterCustom(), [filter, this.filterByField, this.myFilter])

        //ViewOption:
        var view = localStorage.getItem('viewOption')
        if(JSON.parse(view).itemPerPage){
            //this.viewOption = JSON.parse(view);
            // this.itemsPerPage = JSON.parse(view).itemPerPage;
            this.itemsPerPage = JSON.parse(view).itemPerPage | this.itemsPerPage;
        }
         //Validate:
         var y = new Date();
         this.Year = y.getFullYear();
         var formControls = {
            name: ['',[
                Validators.maxLength(255),
                Validators.minLength(1),
                //Validators.pattern(' '),
                Validators.pattern('.*^.*\\S.*[a-zA-z ].* .*'),
                Validators.required,
            ]],
            sex: ['', Validators.required],
            address: ['', [
                Validators.pattern('.*\\S.*[a-zA-z0-9 ].* .*'),
                Validators.maxLength(255),
                Validators.minLength(1),
                Validators.required]],
            linkcv: ['', [
                Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),
                Validators.required
            ]],
            email: ['', [
                Validators.required, 
                Validators.email,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            note: ['', [
                Validators.pattern('.*\\S.*[a-zA-z0-9 ]'),
                // Validators.required
            ]],
            school: ['', Validators.required],
            selectNam: ['', Validators.required],
            formNgonNgu: ['', Validators.required],
            gpa: ['', [
                Validators.min(0),
                Validators.max(4),
                Validators.required
            ]],
            jlpt: ['', [
                Validators.min(1),
                Validators.max(5),
                Validators.pattern('[1-5]*'),
                // Validators.required
            ]],
            phone: ['', [
                Validators.pattern('((09|03|08|07|05)+([0-9]{8}))'),
                //Validators.pattern('[0-9]*'),
                // Validators.pattern('/^[0-9]\d{10}$/'),
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.required
            ]],
            id: [''],
            status: ['']
        }
        this.AddForm = this.formBuilder.group(formControls);
        this.UpdateStudentForm = this.formBuilder.group(formControls);
        this.DetailStudentForm = this.formBuilder.group({
            name:[{disable:true}],
            sex:[{disable:true}],
            address:[{disable:true}],
            linkcv:[{disable:true}],
            email:[{disable:true}],
            note:[{disable:true}],
            school:[{disable:true}],
            selectNam:[{disable:true}],
            formNgonNgu:[{disable:true}],
            gpa:[{disable:true}],
            jlpt:[{disable:true}],
            phone:[{disable:true}],
            // id:[{disable:true}],
            // status:[{disable:true}]
        });
    }
    get f() { return this.AddForm.controls; }
    get u() { return this.UpdateStudentForm.controls; }
    get d() { return this.DetailStudentForm.controls; }

    // public noWhitespaceValidator(control: FormControl) {
    //     const isWhitespace = (control.value || '').trim().length === 0;
    //     const isValid = !isWhitespace;
    //     return isValid ? null : { 'whitespace': true };
    // }
    //Re-get listStudentApi:
    reloadDataAfterSubmit(){
        this.userService.getAll().pipe(first()).subscribe(response=> {
            this.listStudent = response.body;
        });
    }
    //Add them dieu kien filter:
    applyMultipleFilter(value, arrayFilter:any[]){
        const index = arrayFilter.indexOf(value, 0);
        const indexAll = arrayFilter.indexOf('', 0);
        if (index > -1) {
            arrayFilter.splice(index, 1);
            //Them loc tat ca neu ko ton tai dk:
            if(arrayFilter.length == 0){
                arrayFilter.push('');
            }
        }else if(index == -1){
            arrayFilter.push(value);
            //Xoa loc tat ca neu ton tai dieu kien:
            if(indexAll > -1){
                arrayFilter.splice(0, 1);
            }
        }
    }
    //Event add student:
    onSubmitAddStudent(){
        this.submitted = true;
        // Stop here if form is invalid
        if (this.AddForm.invalid) {
            console.log("Form invalid!");
            console.log(this.f.school.value);
            return;
        }
        this.loading = true;
        var FullName = this.f.name.value.trim().toLowerCase();
        var Sex = this.f.sex.value;
        var Address = this.f.address.value.trim().toLowerCase();
        var Email = this.f.email.value.trim().toLowerCase();
        var Phone = this.f.phone.value.trim().toLowerCase();
        var CV = this.f.linkcv.value.trim().toLowerCase();
        var JLPT = this.f.jlpt.value;
        var GPA:number = this.f.gpa.value;
        var Year:number = Number(this.f.selectNam.value);
        var IdLanguages:number = Number(this.f.formNgonNgu.value);
        var IdSchool = this.f.school.value;
        var Details = this.f.note.value;
        this.userService.createStudent(FullName, Sex, Address, Email, Phone, CV, JLPT, GPA, Year,IdLanguages,IdSchool,Details)
            .pipe(first())
            .subscribe(
                response => {
                    console.log("Code = " + response.status + " Message = " + response.body);
                    if(response.status == 200 && response.body != null){
                        //Create success:
                        this.reloadDataAfterSubmit();
                        this.AddForm.reset();
                        this.closeButtonCreate.nativeElement.click();
                        this.toastr.success("Đã thêm mới sinh viên.", "Thành công!",{
                            timeOut: 3000,
                            positionClass: 'toast-top-right',
                            easing: 'ease-in',
                            closeButton : false
                        })
                        this.loading = false;
                    }
                },
                error => {
                    //Create error:
                    this.toastr.warning("Vui lòng kiểm tra lại thông tin!", "Không thành công!",{
                        timeOut: 3000,
                        positionClass: 'toast-top-right',
                        easing: 'ease-in',
                        closeButton : false
                    })
                });
    }
    //Event update student:
    onSubmitUpdateStudent(){
        this.submitted = true;
        // Stop here if form is invalid
        if (this.UpdateStudentForm.invalid) {
            console.log("Form invalid!");
            return;
        }
        this.loading = true;
        var FullName = this.u.name.value;
        var Sex = this.u.sex.value;
        var Address = this.u.address.value;
        var Email = this.u.email.value;
        var Phone = this.u.phone.value;
        var CV = this.u.linkcv.value;
        var JLPT = this.u.jlpt.value;
        var GPA:number = this.u.gpa.value;
        var Year:number = Number(this.u.selectNam.value);
        var IdLanguages:number = Number(this.u.formNgonNgu.value);       
        var IdSchool = this.u.school.value;
        var Details = this.u.note.value;
        var Id = this.u.id.value;
        var Status = this.u.status.value;
        let saveStudent = new Student();
        saveStudent ={ Id : Id, Status : Status, FullName : FullName, Sex : Sex, Address : Address, Email : Email, Phone : Phone, CV : CV, JLPT : JLPT, GPA : GPA, Year : Year, 
            IdLanguages : IdLanguages,IdSchool : IdSchool, Details : Details, NameLanguages:'', NameSchool:''
        }

        console.log(saveStudent);
        this.userService.updateStudent(Id,FullName, Sex, Address, Email, Phone, CV, JLPT, GPA, Year,IdLanguages,IdSchool,Details,Status)
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
                        this.toastr.success("Đã sửa thông tin sinh viên.", "Thành công!",{
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
                    this.toastr.warning("Vui lòng kiểm tra lại thông tin!", "Không thành công!",{
                        timeOut: 3000,
                        positionClass: 'toast-top-right',
                        easing: 'ease-in',
                        closeButton : false
                    })
                });
    }
    //UpdateStatusSinhVien
    updateStatusSinhVien(Id, Name, Status){
        this.userService.updateStatusStudent(Id, Status)
            .pipe(first())
            .subscribe(
                response => {
                    console.log("Code = " + response.status + " Message = " + response.body);
                    if(response.status == 200 && response.body != null){
                        // Update success:
                        // Update status sv trong array da get:
                        let updateItem = this.listStudent.filter(i => i.Id === Id);
                        let index = this.listStudent.indexOf(updateItem[0]);
                        this.listStudent[index].Status = Status; 
                        // this.reloadDataAfterSubmit();
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
                    this.toastr.warning("Vui lòng kiểm tra lại thông tin!", "Không thành công!",{
                        timeOut: 3000,
                        positionClass: 'toast-top-right',
                        easing: 'ease-in',
                        closeButton : false
                    })
                });
    }
    //Phan loai tuyen thang:
    phanLoaiTuyenThang(){
        this.loading = true;
        //var listPhanLoai = <any>document.getElementsByClassName('id-phanloai');
        var listId = [];
        // listPhanLoai.forEach(td => {
        //     var newid = new Id();
        //     newid.id = td.dataset.id
        //     listId.push(newid);
        // });

        //Check dieu kien tuyen thang:
        for (let i = 0; i < listId.length; i++) {

            const itemId = listId[i];
            var filteredArrayStudent = this.listStudent.filter(function (item) {return item.Id == itemId.id;});
            var student = filteredArrayStudent[0];
            if(student.Status != ' '){
                this.toastr.warning(`Sinh viên ${student.FullName} đang trong trạng thái ${this.badgeStatus(student.Status).label}.`, "Lỗi!",{
                    timeOut: 3000,
                    positionClass: 'toast-top-right',
                    easing: 'ease-in',
                    closeButton : true
                })
                this.loading = false;
                return;
            }else if(student.IdSchool != 'HUST' && student.IdSchool != 'VNU-UET' && student.GPA < 2.5 && (student.JLPT != null && student.JLPT <= 5)){
                this.toastr.warning(`Sinh viên không đủ điều kiện tuyển thẳng.`, "Lỗi!",{
                    timeOut: 3000,
                    positionClass: 'toast-top-right',
                    easing: 'ease-in',
                    closeButton : true
                })
                this.loading = false;
                return;
            }
            
        }

        this.userService.approvedStudents(listId)
            .pipe(first())
            .subscribe(
                response => {
                    if(response == "Success"){
                        //Post success:
                        this.reloadDataAfterSubmit();
                        this.toastr.success("Đã phân loại tuyển thẳng.", "Thành công!",{
                            timeOut: 3000,
                            positionClass: 'toast-top-right',
                            easing: 'ease-in',
                            closeButton : true
                        })
                        this.loading = false;
                    }
                },
                error => {
                    //Post error:
                });
    }
    //Confirm truoc khi xoa:
    getInfoStudentDelete(name, id){
        this.nameStudentDelete = name;
        this.idStudentDelete = id;
    }
    //Delete SinhVien
    deleteSinhVien(Id){
        this.loading = true;
        this.userService.deleteStudent(Id)
            .pipe(first())
            .subscribe(
                response => {
                    console.log("Code = " + response.status + " Message = " + response.body);
                    if(response.status == 200 && response.body != null){
                        //Update success:
                        this.btnCloseConfirm.nativeElement.click();
                        this.reloadDataAfterSubmit();
                        this.toastr.success("Đã xóa thông tin sinh viên.", "Thành công!",{
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

                });
    }
    //Detail sv:
    showDetailStudent(Id){
        var filteredArray = this.listStudent.filter(function (item) {
            return item.Id == Id;
        });
        let itemArray = filteredArray[0];
        this.d.name.setValue(itemArray.FullName);
        this.d.sex.setValue(itemArray.Sex);
        this.d.address.setValue(itemArray.Address);
        this.d.linkcv.setValue(itemArray.CV);
        this.d.email.setValue(itemArray.Email);
        this.d.note.setValue(itemArray.Details);
        this.d.school.setValue(itemArray.IdSchool);
        this.d.selectNam.setValue(itemArray.Year);
        this.d.formNgonNgu.setValue(itemArray.IdLanguages);
        this.d.gpa.setValue(itemArray.GPA);
        this.d.jlpt.setValue(itemArray.JLPT);
        this.d.phone.setValue(itemArray.Phone);
        
        this.DetailStudentForm.disable();

    }
    //Sua thong tin
    showEdit(Id){
        var filteredArray = this.listStudent.filter(function (item) {
            return item.Id == Id;
        });
        let itemArray = filteredArray[0];
        this.u.name.setValue(itemArray.FullName);
        this.u.sex.setValue(itemArray.Sex);
        this.u.address.setValue(itemArray.Address);
        this.u.linkcv.setValue(itemArray.CV);
        this.u.email.setValue(itemArray.Email);
        this.u.note.setValue(itemArray.Details);
        this.u.school.setValue(itemArray.IdSchool);
        this.u.selectNam.setValue(itemArray.Year);
        this.u.formNgonNgu.setValue(itemArray.IdLanguages);
        this.u.gpa.setValue(itemArray.GPA);
        this.u.jlpt.setValue(itemArray.JLPT);
        this.u.phone.setValue(itemArray.Phone);
        this.u.id.setValue(itemArray.Id);
        this.u.status.setValue(itemArray.Status);
        console.log(this.u)
    }
    saveViewOptionToSession(){
        localStorage.setItem('viewOption', JSON.stringify(this.viewOption));
    }
    saveItemPerPageToSession(itemPerPage:number){
        this.viewOption.itemPerPage = itemPerPage;
        this.saveViewOptionToSession();
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
    reloadData() {
        this.listStudent = [...this.listStudent];
      }
    toggleSearch(){
        this.isOpen = !this.isOpen;
    }
    filterNotValue(collection, filterKey): any[] {  
        return collection.filter(i => i.value !== filterKey);
    }
    filterNotId(collection, filterKey): any[] {  
        return collection.filter(i => i.Id !== filterKey);
    }
    setOrder(value: string) {
      if (this.order === value) {
        this.reverse = !this.reverse;
      }
      this.order = value;
    }

    showBtnDel = false;
    showBtnDelete(event){
        if(event.target.value){
            this.showBtnDel = true;
        }else{
            this.showBtnDel = false;
        }
    }
    deleteSearch(event){
        this.showBtnDel = false;
        this.filterCUSTOM = '';
        event.path[1].childNodes[0].value = "";
        //Gan lai array filter:
        this.filter = '';
        this.filterByFields();
    }
    reloadComponent() {
        this._router.routeReuseStrategy.shouldReuseRoute = () => false;
        this._router.onSameUrlNavigation = 'reload';
        this._router.navigate(['/danh-sach-sinh-vien']);
    }
    export() {
        this.exportService.exportExcel(this.listStudent, 'DanhSachSinhVien');
    }
    badgeStatus(status){
        return this.dataService.badgeStatus(status);
    }
    onReset() {
        this.submitted = false;
        this.AddForm.reset();
    }
    getFieldNameById(Id, list:any){
        let findName = list.filter(i => i.value === Id);
        return findName[0].label;
    }    
    private valueMin = 0; valueMax = 4;
    filterGPA(event){
        switch (event.value) {
            case "0": this.valueMin=0; this.valueMax = 4; break;
            case "2.499": this.valueMin=0; this.valueMax = 2.49999999999; break;
            case "2.5": this.valueMin=2.5; this.valueMax = 4; break;
            case "3": this.valueMin=3; this.valueMax = 4; break;
            case "3.5": this.valueMin=3.5; this.valueMax = 4; break;
        }
    }
    filterCustom(){
        return this.listStudent.filter(item => item.GPA >= this.valueMin && item.GPA <= this.valueMax);
    }

    filterCUSTOM = '';
    selectField = '';
    filterByField: any = {Id:'', FullName:'', Sex:'', Address:'',Email:'', Phone:'', Year:'', GPA:'',NameLanguages:'', Details:'', Status:'', NameSchool:''};
    filterByFields(){
        if(this.selectField == ''){
            this.filter = this.filterCUSTOM
        }else{
            this.filterByField = {[this.selectField]:''};
            this.filterByField[this.selectField] = this.filterCUSTOM;
        }
    }

    inputCUSTOM(event){
        this.showBtnDelete(event);
        if(this.selectField == ''){
            this.filter = this.filterCUSTOM
        }else{
            this.filterByField[this.selectField] = this.filterCUSTOM;
        }
    }

    //Export file excel



}
