import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Component({ 
    selector: 'login-cmp',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
 })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    private inputPassword;
    private showPassBtn;
    private hidePassBtn;
    private inputRememberMe;
    private remember = "remember";
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        console.log(this.authenticationService.currentUserValue);
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {
        this.inputPassword = <HTMLElement>document.getElementsByClassName('input-password')[0];
        this.showPassBtn = <HTMLElement>document.getElementsByClassName('fa-eye')[0];
        this.hidePassBtn = <HTMLElement>document.getElementsByClassName('fa-eye-slash')[0];
        

        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['/dashboard'];
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.inputRememberMe = <HTMLElement>document.getElementById('customControlInline');
        this.loading = true;
        if(this.inputRememberMe.checked == false){
            this.remember = "notRemember";
        }
        console.log(this.remember);
        this.authenticationService.login(this.f.email.value, this.f.password.value, this.remember)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.TokenKey) { 
                        this.router.navigate(['/dashboard']);
                    }else{
                        this.error = "The email address or password is incorrect!";
                        this.loading = false;
                    }
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
    showPassword(){
        this.inputPassword.type = "text";
        this.showPassBtn.classList.add('d-none');
        this.hidePassBtn.classList.remove('d-none');
    }
    hidePassword(){
        this.inputPassword.type = "password";
        this.showPassBtn.classList.remove('d-none');
        this.hidePassBtn.classList.add('d-none');
    }
}
