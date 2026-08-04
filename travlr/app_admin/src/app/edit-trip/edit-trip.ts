import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  public trip!: Trip;
  public submitted = false;
  public message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripData
  ) {}

  ngOnInit(): void {
    // Retrieve stashed trip ID
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTrip::ngOnInit');
    console.log('tripcode: ' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: any) => {
        this.trip = value;

        if (!value || (Array.isArray(value) && value.length === 0)) {
          this.message = 'No Trip Retrieved!';
        } else {
          // Populate our record into the form
          const tripData = Array.isArray(value) ? value[0] : value;
          this.editForm.patchValue(tripData);
          this.message = 'Trip: ' + tripCode + ' retrieved';
        }

        console.log(this.message);
      },
      error: (error: any) => {
        console.error('Error fetching trip: ', error);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.error('Error updating trip: ', error);
        }
      });
    }
  }

  // Convenient getter for easy access to form fields in the HTML template
  get f() {
    return this.editForm.controls;
  }
}