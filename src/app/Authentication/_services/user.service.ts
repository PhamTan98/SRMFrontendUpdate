import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User, Student, PointTestUpdate, Id } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    headers = new HttpHeaders();
    
    constructor(private http: HttpClient) { 
        this.headers = this.headers.set('Content-Type', 'application/json');
    }
    //Student;
    getAll() {
        return this.http.get<Student[]>(`${environment.apiUrl}/students/GetAllStudents`,{observe: 'response'});
    }
    createStudent(FullName: string,Sex: string,Address: string,Email: string,Phone: string,CV: string,JLPT: number,GPA: number,Year: number,IdLanguages: number,IdSchool: string,Details: string) {
        return this.http.post<any>(`${environment.apiUrl}/students/createstudents`,{FullName, Sex, Address, Email, Phone, CV, JLPT, GPA, Year,IdLanguages,IdSchool,Details},{observe: 'response'});
    }
    updateStudent(Id: number, FullName: string,Sex: string,Address: string,Email: string,Phone: string,CV: string,JLPT: number,GPA: number,Year: number,IdLanguages: number,IdSchool: string,Details: string, Status:string) {
        return this.http.post<any>(`${environment.apiUrl}/students/updatestudents`,{Id, FullName, Sex, Address, Email, Phone, CV, JLPT, GPA, Year,IdLanguages,IdSchool,Details, Status},{observe: 'response'});
    }
    updateStatusStudent(Id: number, Status:string) {
        return this.http.post<any>(`${environment.apiUrl}/students/UpdateStatusStudents`,{Id, Status},{observe: 'response'});
    }
    deleteStudent(Id: number) {
        return this.http.post<any>(`${environment.apiUrl}/students/deleteStudents`,{ Id },{observe: 'response'});
    }
    getListStudentByStatus(status:string) {
        return this.http.get<any[]>(`${environment.apiUrl}/students/getStudentWithStatus`,{params: {status: status},observe: 'response'});
    }
    approvedStudents(listId: Id[]){
        return this.http.post<any>(`${environment.apiUrl}/students/approvedStudents`, listId , {headers: this.headers});
    }

    //Info:
    getSakuraSchoolLanguages() {
        return this.http.get<any[]>(`${environment.apiUrl}/students/getSakuraSchoolLanguages`,{observe: 'response'});
    }

    //User:
    getUsers() {
        return this.http.get<any[]>(`http://api-sakura.ominext.co/api/accounts/getListAccount`, { observe: 'response' });
    }
    createUsers( FullName: string, Password: string, Email: string, Position: string) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/accounts/createAccount`, {FullName, Password, Email, Position }, { observe: 'response' });
    }
    updateUsers(Id: number, FullName: string, Password: string, Email: string, Position: string) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/accounts/setAccount`, { Id, FullName, Password, Email, Position }, { observe: 'response' });
    }
    deleteUsers(Id: number) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/accounts/deleteAccount`, { Id }, { observe: 'response' });
    }

    //Bai test:
    createTests( name: string, IdSakuraCampus: number, Details: string, LstIdTestSubject: string ){
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/createTests`, { name, IdSakuraCampus, Details, LstIdTestSubject}, { observe: 'response' });
    }
    updateTests(id: number, name: string, IdSakuraCampus: number, Details: string, LstIdTestSubject: string, status: string, lstSinhVien: PointTestUpdate[]){
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/updateTests`, { id, name, IdSakuraCampus, Details, LstIdTestSubject, status , lstSinhVien }, { observe: 'response' });
    }
    deleteTests(id: number) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/DeleteTests`, { id }, { observe: 'response' });
    }
    getListTest() {
        return this.http.get<any[]>(`http://api-sakura.ominext.co/api/test/getListTests`, { observe: 'response' });
    }
    GetTestsDetail(id:number){
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/GetTestsDetail`, { id }, {observe: 'response'});
    }
    ImportFileTest(file: File){
        let input = new FormData();
        input.append("file", file);
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/ImportFileTest`, input);
    }
    
    //Loai test:
    getTestSubject() {
        return this.http.get<any>(`http://api-sakura.ominext.co/api/test/GetListTestSubject `, { observe: 'response' });
    }
    createTestSubject(Id: string, Name: string, Max: number, Pass: number) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/createTestSubject`, { Id, Name, Max, Pass }, { observe: 'response' });
    }
    updateTestSubject(Id: string, Name: string, Max: number, Pass: number, Status: string) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/updateTestSubject`, { Id, Name, Max, Pass, Status }, { observe: 'response' });
    }
    getAllListTest() {
        return this.http.get<any>(`http://api-sakura.ominext.co/api/test/getListTests `, { observe: 'response' });
    }

    //Student Test
    GetListStudentTests(Id: number) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/GetListStudentTests`, { Id }, { observe: 'response' });
    }
    
    private Tests = {Id: Number};
    private SinhViens = [{id: Number, fullname: String}];
    postArrangeTestResults(SinhViens){
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/postArrangeTestResults`, {SinhViens}, { observe: 'response' });
    }
    postSinhVienToTest(Tests, SinhViens) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/postSinhVienToTest`, { Tests, SinhViens}, { observe: 'response' });
    }
    deleteSinhVienInStatusTest(Id: number) {
        return this.http.post<any>(`http://api-sakura.ominext.co/api/test/deleteSinhVienInStatusTest`, { Id }, { observe: 'response' });
    }
}