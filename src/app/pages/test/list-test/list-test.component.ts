import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, MinLengthValidator } from '@angular/forms';
import { UserService, AuthenticationService } from '../../../Authentication/_services';
import { DataService} from '../../../_services/share-data.service';
import { first } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { PointTestUpdate } from '../../../Authentication/_models';

// const URL = '/api/';
const URL = 'https://localhost:44311/Upload/UploadFile';

@Component({
  selector: 'app-list-bai-test',
  templateUrl: './list-test.component.html',
  styleUrls: ['./list-test.component.scss']
})

export class ListBaiTestComponent implements OnInit {
  p: number = 1; p2:number = 1; private itemsPerPage = 10;
  listBaiTest = []; listStudentTest = [];  testDetail; listIdTestSubject = [];
  private ListTestSubject =[]; ListTest=[];

  listSakura = [];
  listTestStatus = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
  ]
  private checkedIdModal = true;

  TestDetailForm: FormGroup; UpdateTestForm: FormGroup; AddTestForm: FormGroup;
  AddTypeTestForm: FormGroup; UpdateTypeTestForm: FormGroup; DetailTypeTestsForm:FormGroup;
  submitted = false; loading = false;

  order: string = 'FullName'; reverse: boolean = false;
  myFilter: any =  {IdSakuraCampus: ''};

  @ViewChild('closeModalUpdateTypeTest', { static: false }) closeButtonUpdate: ElementRef;
  @ViewChild('closeModalAddTypeTest', { static: false }) closeButtonCreate: ElementRef;
  @ViewChild('closeModalAddTest', { static: false }) closeModalAddTestBtn: ElementRef;
  @ViewChild('closeUpdateTestModal', { static: false }) closeModalUpdateTestBtn: ElementRef;


  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  constructor(private userService: UserService,private toastr: ToastrService, private formBuilder: FormBuilder, private dataService: DataService) { 
    //Upload file:
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
    this.uploader.response.subscribe(res => this.response = res);
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

 

  ngOnInit() {
    this.userService.getSakuraSchoolLanguages().pipe(first()).subscribe(response=> {
      this.listSakura =  response.body["Sakuras"];
      this.listSakura.unshift({Id:'', Name:'Tất cả'})
    }) 
    this.userService.getTestSubject().pipe(first()).subscribe(response => {
      this.ListTestSubject = response.body;
      console.log(this.ListTestSubject);
    });
    this.userService.getListTest().pipe(first()).subscribe(response=> {
      this.listBaiTest =  response.body;
    }) 

    //Form bai test:
    this.AddTestForm = this.formBuilder.group({
      khoa: [null, [
        Validators.required
      ]],
      title: ['', [
        Validators.required
      ]],
      typeTest: [null, [
        Validators.required
      ]],
      description: ['', [
        Validators.required
      ]],
      // status: ['', [
      //   Validators.required
      // ]],
      // timeTest: ['', [
      //   Validators.required
      // ]],
      file: [null, [
        Validators.required
      ]]
    });
    this.TestDetailForm = this.formBuilder.group({
      khoa: [''],
      title: [''],
      typeTest: [''],
      description: [''],
      status: [''],
      timeTest: [''],
    })
    this.TestDetailForm.disable();

    this.UpdateTestForm = this.formBuilder.group({
      khoa: [null, [
        Validators.required
      ]],
      title: ['', [
        Validators.required
      ]],
      typeTest: [null, [
        Validators.required
      ]],
      description: ['', [
        Validators.required
      ]],
      status: [''],
      timeTest: [''],
      file: [null],
      id: [null]
    })

    //Form type test:
    this.AddTypeTestForm = this.formBuilder.group({
      Id: ['', [
        Validators.maxLength(50),
        Validators.minLength(1),
        Validators.required
      ]],
      Name: ['', [
        Validators.maxLength(250),
        Validators.minLength(1),
        Validators.required
      ]],
      Max: ['', [ 
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.min(0),
        Validators.required
      ]],
      Pass: ['', [ 
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.min(0),
        Validators.required
      ]]
    });
    this.UpdateTypeTestForm = this.formBuilder.group({
      Id: ['', [
        Validators.maxLength(50),
        Validators.minLength(1),
        Validators.required
      ]],
      Name: ['', [
        Validators.maxLength(250),
        Validators.minLength(1),
        Validators.required
      ]],
      Max: ['', [
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.min(0),
        Validators.required
      ]],
      Pass: ['', [
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.min(0),
      
      ]],
      Status: ['', [
        Validators.required
      ]]
    });
    this.DetailTypeTestsForm = this.formBuilder.group({
      Id: [{ disable: true }],
      Name: [{ disable: true }],
      Max: [{ disable: true }],
      Pass: [{ disable: true }],
      Status: [{ disable: true }],
      CreateDate: [{ disable: true }],
    });
    this.DetailTypeTestsForm.disable();

  }
  //Bai test:
  get f() { return this.AddTestForm.controls; }
  get t() { return this.TestDetailForm.controls; }
  get u() { return this.UpdateTestForm.controls; }

  //Loai test:
  get addTypeTestForm() { return this.AddTypeTestForm.controls; }
  get updateTypeTestForm() { return this.UpdateTypeTestForm.controls; }
  get detailTypeTestForm() { return this.DetailTypeTestsForm.controls; }

  
  appendByCheckBox(event){
    // if(event.target.value && this.listIdStudentChecked.indexOf(event.target.value) == -1){
    //   this.listIdStudentChecked.push(event.target.value);
    // }else{
    //   this.listIdStudentChecked.splice(this.listIdStudentChecked.indexOf(event.target.value),1);
    // }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
  showTestDetail(id){
    this.userService.GetTestsDetail(id).pipe(first()).subscribe(response => {
      this.testDetail = response.body["Tests"];
      this.listStudentTest = response.body["SinhViens"];
      this.listIdTestSubject = response.body["Tests"].LstIdTestSubject.split(";")

      // response.body["SinhViens"][0]["TestMarkDetail"].forEach(e => {
      //   console.log(e.IdTestSubject);
      // });

      this.t.khoa.setValue(this.testDetail.IdSakuraCampus);
      this.t.title.setValue(this.testDetail.Name);
      this.t.typeTest.setValue(this.testDetail.LstIdTestSubject);
      this.t.description.setValue(this.testDetail.Details);
      this.t.status.setValue(this.testDetail.Status);
      this.t.timeTest.setValue(this.testDetail.ExpectedDate);
    });
  }
  
  showTestUpdate(id){

    this.userService.GetTestsDetail(id).pipe(first()).subscribe(response => {
      this.testDetail = response.body["Tests"];
      this.listStudentTest = response.body["SinhViens"];
      this.listIdTestSubject = response.body["Tests"].LstIdTestSubject.split(";");
      // console.log("this.listIdTestSubject");
      // console.log(this.listIdTestSubject);
      this.u.id.setValue(this.testDetail.Id);
      this.u.khoa.setValue(this.testDetail.IdSakuraCampus);
      this.u.title.setValue(this.testDetail.Name);
      this.u.typeTest.setValue(this.listIdTestSubject);
      this.u.description.setValue(this.testDetail.Details);
      this.u.status.setValue(this.testDetail.Status);
      this.u.timeTest.setValue(this.testDetail.ExpectedDate);
    });

  }
  //Submit add test form:
  onSubmitAddTest(){
    this.submitted = true;
    if (this.AddTestForm.invalid) {
      console.log("Form invalid!");
      return;
    }
    this.loading = true;
    var IdSakura = Number(this.f.khoa.value);
    var Name = this.f.title.value;
    var listTypeTest = this.f.typeTest.value.toString().split(',').join(';');
    var Details = this.f.description.value;
    // var Status = this.f.status.value;
    // var Time = this.f.timeTest.value;

    //Upload file:
    var file = this.uploader.queue[0]._file;
    console.log("file");
    console.log(this.uploader.queue[0]);
    var checkUploadFile = true;
    this.uploader.queue.forEach(item => {
      if(this.uploadFile(item._file) == false){
        checkUploadFile = false;
      }
    })
    if(!checkUploadFile){
      this.toastr.warning("Kiểm tra lại file.", "Lỗi upload file!",{
        timeOut: 3000,
        positionClass: 'toast-top-right',
        easing: 'ease-in',
        closeButton : false
      })
      this.loading = false;
      return;
    }

    this.userService.createTests(Name, IdSakura, Details, listTypeTest)
            .pipe(first())
            .subscribe(
                response => {
                    console.log("Code = " + response.status + " Body = " + response);
                    if(response.status == 200 && response.body != null){
                        //Success:
                          this.reloadTestDataAfterSubmit();
                          this.submitted = false;
                          this.AddTestForm.reset();
                          this.closeModalAddTestBtn.nativeElement.click();
                          this.toastr.success("Đã thêm mới bài test.", "Thành công!",{
                              timeOut: 3000,
                              positionClass: 'toast-top-right',
                              easing: 'ease-in',
                              closeButton : false
                          })
                          this.loading = false;
                    }
                },
                error => {
                    //Error:
                });
  }
  //Upload one file:
  uploadFile(file: File){
    this.userService.ImportFileTest(file)
    .pipe(first())
    .subscribe(
        response => {
            if(response != ""){
                //Success:
                return true;
            }
        },
        error => {
            return false;
        });
    return false;
  }
  //Submit add test form:
  onSubmitUpdateTest(){
    this.submitted = true;
    if (this.UpdateTestForm.invalid) {
      console.log("Form invalid!");
      return;
    }
    this.loading = true;

    var listIdStudentChecked = [];
    var listIdS = <any>document.getElementsByClassName('check-id');
    
    listIdS.forEach(input => {
      if(input.checked == true){
        listIdStudentChecked.push(input.value)
      }
    })
    
    var Id = Number(this.u.id.value);
    var IdSakura = Number(this.u.khoa.value);
    var Name = this.u.title.value;
    var listTypeTest = this.u.typeTest.value.toString().split(',').join(';');
    var Details = this.u.description.value;
    var Status = this.u.status.value;

    var listPointUpdate= [];
    var listScore = <any>document.getElementsByClassName('input-score');
    console.log(listScore);
    listScore.forEach(input => {
      // console.log("Student="+input.dataset.student+"Test ="+input.dataset.test+"Value ="+input.value);
      if(listIdStudentChecked.indexOf(input.dataset.student) > -1){
        var point = new PointTestUpdate();
        point.IdSinhVien = input.dataset.student;
        point.IdTestSubject = input.dataset.test;
        point.Point = input.value;
        listPointUpdate.push(point)
      }
    })
    
    this.userService.updateTests(Id, Name, IdSakura, Details, listTypeTest, Status, listPointUpdate)
            .pipe(first())
            .subscribe(
                response => {
                    console.log("Code = " + response.status + " Body = " + response);
                    if(response.status == 200 && response.body != null){
                        //Success:
                        this.reloadTestDataAfterSubmit();
                        this.submitted = false;
                        this.UpdateTestForm.reset();
                        this.closeModalUpdateTestBtn.nativeElement.click();
                        this.toastr.success("Đã sửa thông tin bài test.", "Thành công!",{
                            timeOut: 3000,
                            positionClass: 'toast-top-right',
                            easing: 'ease-in',
                            closeButton : false
                        })
                        this.loading = false;
                    }
                },
                error => {
                    //Error:
                });
  }
  checkAll(event: any){
  }
  badgeStatus(status){
    return this.dataService.badgeStatusUsers(status);
  }
  //Check string ton tai trong list object(loai hinh test):
  checkExistArray(value, listObj:[]){
    for (let i = 0; i < listObj.length; i++) {
      if(value == listObj[i]["IdTestSubject"]){
        return i;
      }
    }
    return -1;
  }
  //Detail type test:
  showDetailListTest(Id) {
    var filteredArray = this.ListTest.filter(function (item) {
      return item.Id == Id;
    });
    let itemArray = filteredArray[0];
    this.detailTypeTestForm.Id.setValue(itemArray.id);
    this.detailTypeTestForm.Name.setValue(itemArray.Name);
    this.detailTypeTestForm.Max.setValue(itemArray.Max);
    this.detailTypeTestForm.Pass.setValue(itemArray.Pass);
    this.detailTypeTestForm.Status.setValue(itemArray.Status);
    this.detailTypeTestForm.CreateDate.setValue(itemArray.CreateDate);

  }
  //Show form edit type test:
  showEditTest(Id) {
    var filteredArray = this.ListTestSubject.filter(function (item) {
      return item.Id == Id;
    });
    let itemArray = filteredArray[0];
    this.updateTypeTestForm.Id.setValue(itemArray.Id);
    this.updateTypeTestForm.Name.setValue(itemArray.Name);
    this.updateTypeTestForm.Max.setValue(itemArray.Max);
    this.updateTypeTestForm.Pass.setValue(itemArray.Pass);
    this.updateTypeTestForm.Status.setValue(itemArray.Status);

    if(this.updateTypeTestForm.Pass.value <= this.updateTypeTestForm.Max.value){
      this.passUpdateThanMax = false;
    }

  }
  reloadTypeTestDataAfterSubmit() {
    this.userService.getTestSubject().pipe(first()).subscribe(response => {
      this.ListTestSubject = response.body;
    });
  }
  reloadTestDataAfterSubmit() {
    this.userService.getListTest().pipe(first()).subscribe(response => {
      this.listBaiTest = response.body;
    });
  }
  private passCreatThanMax = false;
  private passUpdateThanMax = false;
  //Submit add type test:
  onSubmitAddListTestSubject() {
    this.submitted = true;
    if (this.AddTypeTestForm.invalid) {
      console.log("Form invalid!");
      return;
    }
    var Id = this.addTypeTestForm.Id.value;
    var Name = this.addTypeTestForm.Name.value;
    var Max = Number(this.addTypeTestForm.Max.value);
    var Pass = Number(this.addTypeTestForm.Pass.value);
    if(Pass > Max){
      this.passCreatThanMax = true;
      return;
    }else{
      this.passCreatThanMax = false;
    }
    this.loading = true;
    this.userService.createTestSubject(Id, Name, Max, Pass)
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            //Create success:
            this.reloadTypeTestDataAfterSubmit();
            
            this.AddTypeTestForm.reset();
            this.closeButtonCreate.nativeElement.click();
            this.toastr.success("Đã thêm mới loại hình kiểm tra.", "Thành công!", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              easing: 'ease-in',
              closeButton: false
            })
            this.loading = false;
          }
        },
        error => {
          // Create error:
          this.toastr.warning("Vui lòng kiểm tra lại thông tin!", "Đã tồn tại ID!", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton: false
          })
          this.loading = false;
        });
  }
  //Submit update type test:
  onSubmitUpdateTestSubject(UpdateTestSubjectForm) {
    this.submitted = true;
    if (this.UpdateTypeTestForm.invalid) {
      console.log("Form invalid!");
      return;
    }
    var Id = this.updateTypeTestForm.Id.value;
    var Name = this.updateTypeTestForm.Name.value;
    var Max = Number(this.updateTypeTestForm.Max.value);
    var Pass = Number(this.updateTypeTestForm.Pass.value);
    var Status = this.updateTypeTestForm.Status.value;

    if(Pass > Max){
      this.passUpdateThanMax = true;
      return;
    }else{
      this.passUpdateThanMax = false;
    }
    this.loading = true;
    this.userService.updateTestSubject(Id, Name, Max, Pass, Status)
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            this.reloadTypeTestDataAfterSubmit();
            this.closeButtonUpdate.nativeElement.click();
            this.toastr.success("Đã sửa thông tin loại hình kiểm tra.", "Thành công!", {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              easing: 'ease-in',
              closeButton: false
            })
            this.loading = false;
          }
        },
        // else (Response.status == 500)
        error => {

          this.toastr.warning("Vui lòng kiểm tra lại thông tin!", "Không thành công!", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton: false
          })

        });
  }
  idTestDelete;
  getInfoTestDelete(id) {
    this.idTestDelete = id;
  }
  //Delete test:
  deleteTest(Id) {
    this.loading = true;
    this.userService.deleteTests(Id)
      .pipe(first())
      .subscribe(
        response => {
          console.log("Code = " + response.status + " Message = " + response.body);
          if (response.status == 200 && response.body != null) {
            //Update success:
            // this.btnCloseConfirm.nativeElement.click();
            // this.reloadDataAfterSubmit();
            this.toastr.success("Đã xóa bài test.", "Thành công!", {
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
  showInputScore(event) {
    var listTemp = [];
    event.forEach(item=>{
      listTemp.push(item.Id);
    });
    this.listIdTestSubject = listTemp;
  }
  resetAddTypeTestForm() {
    this.submitted = false;
    this.AddTypeTestForm.reset();
    this.passCreatThanMax = false;
  }
  filterNotId(collection, filterKey): any[] {  
    return collection.filter(i => i.Id !== filterKey);
  }
}
