import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { User } from '../shared/user';
import { AuthService } from '../services/auth.service'
import { TodoService } from '../services/todo.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  user: User;
  errMess: string;
  loginRequest : boolean = false;


  registerFormErrors = {
    'username': '',
    'password': '',
    'confirmPassword': '',
    'secret':'',
  };

  loginFormErrors = {
    'username': '',
    'password': ''
  };

  registerFormValidationMessages = {
    'username': {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 2 characters long.',
      'maxlength':     'Username cannot be more than 25 characters long.'
    },
    'password': {
      'required':      'Password is required.',
      'minlength':     'Password must be at least 2 characters long.',
      'maxlength':     'Password cannot be more than 25 characters long.'
    },
    'confirmPassword': {
      'required':      'Confirm password is required.',
      'minlength':     'Password must be at least 2 characters long.',
      'maxlength':     'Password cannot be more than 25 characters long.'
    },
    'secret': {
      'minlength':     'secret is required.'
    }
  };
  
  loginFormValidationMessages = {
    'username': {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 2 characters long.',
      'maxlength':     'Username cannot be more than 25 characters long.'
    },
    'password': {
      'required':      'Password is required.',
      'minlength':     'Password must be at least 2 characters long.',
      'maxlength':     'Password cannot be more than 25 characters long.'
    }
  };

  constructor(private fb: FormBuilder, private authService: AuthService,
    private todoService : TodoService
  ) { 
    this.createLoginForm();
    this.createRegisterForm();
  }

  ngOnInit() {
  }

  createRegisterForm() {
  
    this.registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    confirmPassword: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    secret: ['', [Validators.required] ],
    facebook: '',
    admin: false
    });
    
    this.registerForm.valueChanges.subscribe(data => this.registerFormOnValueChange(data));
    this.registerFormOnValueChange();
  }

  createLoginForm() {
  
    this.loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    firstname: '',
    lastname: '',
    facebook: '',
    admin: false
    });

    this.loginForm.valueChanges.subscribe(data => this.loginFormOnValueChange(data));
    this.loginFormOnValueChange();
  }

  login() {
    if (this.loginRequest) {
      // console.log("A request is already pending");
      return;
    }
    this.user = this.loginForm.value;
      
    // console.log("login post req with user: ", this.user);
    this.loginRequest = true;
    this.authService.logIn(this.user).subscribe(res => {
      if (res.success) {
        this.loginRequest = false;
        console.log("successfully logged in");
      }
      else {
        console.log("error in logging in: ",res);
        this.loginRequest = false;
      }
    },
    error => {
      this.loginRequest = false;
      this.loginForm.reset({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        facebook: '',
        admin: false
      });

      if (error.status==401) {
        this.loginFormErrors.username = "Username or password is incorrect.";
        this.loginForm.controls['username'].setErrors({'incorrect': true});
        this.loginForm.controls['password'].setErrors({'incorrect': true});
      }

      console.log("error in logging in : ", error);
      this.errMess = error;
    });
  }

  register() {
    if (this.loginRequest) {
      // console.log("A request is already pending");
      return;
    }
    var tempUser = this.registerForm.value;
    if (tempUser.confirmPassword!==tempUser.password) {
      this.registerFormErrors.confirmPassword = "Password confirmation does'nt match";
      this.registerForm.controls['confirmPassword'].setErrors({'incorrect': true});
      return;
    }
    delete tempUser.confirmPassword;
    this.user = tempUser;
    this.loginRequest = true;
    this.authService.signUp(this.user).subscribe(res => {
      if (res.success) {
        this.authService.storeUserCredentials({username: this.user.username, token: res.token});
        this.loginRequest = false;
        console.log("successfully registered");
        // this.dialogRef.close(res.success);          
      }
      else {
        this.loginRequest = false;
        this.registerFormErrors.secret = res.err;
        this.registerForm.controls['secret'].setErrors({'incorrect': true});
        console.log("error in logging in : ", res);
      }
    },
    error => {
      this.loginRequest = false;
      this.registerForm.reset({
        username: '',
        password: '',
        confirmPassword: '',
        secret: '',
        facebook: '',
        admin: false
      });

      if (error.status==500) {
        this.registerFormErrors.username = error.error.err.message;
        this.registerForm.controls['username'].setErrors({'incorrect': true});
      }
      this.errMess = error;
      
    });
  }

  loginFormOnValueChange(data?: any) {
    if (!this.loginForm) { 
      return; 
    }
    const form = this.loginForm;
    for (const field in this.loginFormErrors) {
      this.loginFormErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.loginFormValidationMessages[field];
        for (const key in control.errors) {
          this.loginFormErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  registerFormOnValueChange(data?: any) {
    if (!this.registerForm) { 
      return; 
    }
    const form = this.registerForm;
    for (const field in this.registerFormErrors) {
      this.registerFormErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.registerFormValidationMessages[field];
        for (const key in control.errors) {
          this.registerFormErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}