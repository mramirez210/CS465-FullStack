import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css',
})
export class AddTrip implements OnInit {
  public addForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (error: any) => {
          console.log('Error:', error);
          if (error?.status === 409) {
            this.errorMessage = 'Trip code already exists. Please use a unique code.';
          } else {
            this.errorMessage = 'Unable to save trip. Please try again.';
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  get f() {
    return this.addForm.controls;
  }
}
