import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService, UserService } from '../services';


@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  cardImageBase64: any;
  FileBase64: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    // private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      gender: ['Male', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      image: [null],
      imageName: [''],
      resume: ['', Validators.required],
      resumeName: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.controls['image'].invalid) {
      alert('upload image');
      return;
    }
    if (this.registerForm.controls['resume'].invalid) {
      alert('upload resume');
      return;
    }

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }



    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          // this.alertService.success('Registration successful', true);
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error => {
          alert(error);
          // this.alertService.error(error);
          this.loading = false;
        });
  }


  handleImageInput(imageInput: any) {
    this.registerForm.controls['imageName'].setValue(imageInput.target.files[0].name);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
        const imgBase64Path = e.target.result;
        this.cardImageBase64 = imgBase64Path;
        this.registerForm.controls['image'].setValue(this.cardImageBase64, { emitModelToViewChange: false });
      };
    };
    reader.readAsDataURL(imageInput.target.files[0]);
  }

  handleFileInput(FileInput: any) {
    this.registerForm.controls['resumeName'].setValue(FileInput.target.files[0].name);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imgBase64Path = e.target.result;
      this.FileBase64 = imgBase64Path;
      this.registerForm.controls['resume'].setValue(this.FileBase64, { emitModelToViewChange: false });
    };
    reader.readAsDataURL(FileInput.target.files[0]);
  }
}
