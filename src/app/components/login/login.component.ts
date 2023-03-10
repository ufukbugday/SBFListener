import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthRequest } from 'src/app/models/auth/auth-request.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailMessage: string;

  private validationMessages: {[key: string]: string} = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private fb: FormBuilder, private loginSevice: LoginService, private storageService: StorageService, private router: Router) { }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl("/greetings");
    }
    this.loginForm = this.fb.group({
      email: ['sean@test.com', [Validators.required, Validators.email]],
      password: ['SeanPass', Validators.required]
    });

    const emailControl = this.loginForm.get('email');
    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => this.setMessage(emailControl)
    );
  }

  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.loginSevice.authorize(new AuthRequest(email, password)).subscribe(response => {
      this.storageService.saveToken(response.data.token);
      this.router.navigateByUrl("/greetings");
    });
  }

  setMessage(c: AbstractControl): void{
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ')
    }
  }
}