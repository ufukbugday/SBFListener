import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    const emailControl = this.loginForm.get('email');
    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => this.setMessage(emailControl)
    );
  }

  login() {
    alert("Yeah")
  }

  setMessage(c: AbstractControl): void{
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ')
    }
  }
}