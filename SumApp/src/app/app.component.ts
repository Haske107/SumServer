import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {transition, style, animate, trigger, state} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MustMatch} from './helper/validate-password';
import {HttpClient} from '@angular/common/http';


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
    ]),
    trigger('CardSlideOut', [
      transition('* => void', [
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateX(300%)'}))
      ])
    ]),
    trigger('Videoslide', [
      state('in', style({transform: 'translateX(0%)'})),
      transition('void => *', [
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateX(0%)'}))
      ]),
      state('out', style({transform: 'translateX(-300%)'}))

    ])
  ]
})

export class AppComponent implements OnInit, OnDestroy {

  // VARIABLES
  stillPhotoSelector = false;
  stillPhotoCounter = 1;
  stillPhotoID = 1;
  stillPhotoTimeOut;
  registerForm: FormGroup;
  validated = false;
  renderarray: any = [];
  contentLoaded = false;
  SidePanelOpen = false;
  currentvideoindex = 0;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient, private _ChangeDetectorRef: ChangeDetectorRef) {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    }, {
      validator: MustMatch('password')
    });
  }

  ngOnInit()  {
    this.photo_rotate_start();
    this.getRenderArray();
  }

  ngOnDestroy() {
    this.photo_rotate_end();
  }

  // FUNCTION
    getRenderArray()  {
      this.http.get('https://18.224.16.181:3000/getRenders')
        .subscribe((data: Array<any>) =>  {
        data.forEach((render) => {
           this.renderarray.push({
             Key: render.Key,
             Sentiment: parseInt(render.Sentiment, 10),
             Chronology: parseInt(render.Chronology, 10),
             Date: render.Date,
             Count: render.Count
           });
        });
        this.renderarray.sort((renderA, renderB) => {
           return renderB.Count - renderA.Count
        });
        this._ChangeDetectorRef.detectChanges();
        this.contentLoaded = true;
      });
    }
    photo_rotate_start()  {
      this.stillPhotoTimeOut = setInterval(() =>  {
        this.rotate_photos();
      }, 2000);
    }
    photo_rotate_end()  {
      clearInterval(this.stillPhotoTimeOut);
    }
    rotate_photos() {
      // check if counter is in range
      if (this.stillPhotoCounter > 6) {
        this.stillPhotoCounter = 1;
      }
      // flip selector
      this.stillPhotoSelector = !this.stillPhotoSelector;
      // assign ID
      if (this.stillPhotoSelector)  {
        this.stillPhotoID = this.stillPhotoCounter;
        this.stillPhotoCounter += 1;
      } else  {
        this.stillPhotoID = 0;
      }




    }
    onSubmit() {

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    } else {
      this.snackBar.open('Welcome, Friend', '', {
        duration: 3000
      });
      this.validated = true;

    }
  }
    setCurrentVideo(selectedVideo: number) {
      this.currentvideoindex = selectedVideo;
    }


    get f() { return this.registerForm.controls; }


}
