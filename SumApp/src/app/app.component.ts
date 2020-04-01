import {Component, OnDestroy, OnInit} from '@angular/core';
import {transition, style, animate, trigger, state} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MustMatch} from './helper/validate-password';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fade', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(900 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(900, style({opacity: 0})))
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  validated = false;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    }, {
      validator: MustMatch('password')
    });
  }

  ngOnInit()  {
    this.photo_rotate_start();
  }

  ngOnDestroy() {
    this.photo_rotate_end();
  }





  // VARIABLES
  Still_Photo_Selector = false;
  Still_Photo_Counter = 1;
  Still_Photo_ID = 1;
  Still_Photo_TimeOut;

  Password = "TunaFishBish";

  // FUNCTIONS
    photo_rotate_start()  {
      this.Still_Photo_TimeOut = setInterval(() =>  {
        this.rotate_photos();
      }, 2000);
    }

    photo_rotate_end()  {
      clearInterval(this.Still_Photo_TimeOut);
    }

    rotate_photos() {
      // check if counter is in range
      if (this.Still_Photo_Counter > 7)
        this.Still_Photo_Counter = 1;
      // flip selector
      this.Still_Photo_Selector = !this.Still_Photo_Selector;
      // assign ID
      if (this.Still_Photo_Selector)  {
        this.Still_Photo_ID = this.Still_Photo_Counter;
        this.Still_Photo_Counter += 1
      } else  {
        this.Still_Photo_ID = 0;
      }




    }


  get f() { return this.registerForm.controls; }

    onSubmit() {

      // stop here if form is invalid
      if (this.registerForm.invalid) {
        return;
      } else {
        this.snackBar.open('Welcome, Friend');
        this.validated = true;

      }

    }

}
