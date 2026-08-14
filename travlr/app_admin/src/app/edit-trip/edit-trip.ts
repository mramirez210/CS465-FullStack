import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';
  private originalTripCode = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    var tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something went wrong, couldn't find tripCode.");
      this.router.navigate(['']);
      return;
    }

    this.originalTripCode = tripCode;

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: Trip) => {
        this.trip = value;

        this.editForm.patchValue({
          ...value,
          start: this.formatDate(value.start),
        });

        this.message = `Trip ${tripCode} retrieved`;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.log('Error:', error);
        this.cdr.detectChanges();
      },
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.originalTripCode, this.editForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (error: unknown) => {
          console.log('Error:', error);
        },
      });
    }
  }

  private formatDate(value: string): string {
    if (!value) {
      return '';
    }

    return new Date(value).toISOString().slice(0, 10);
  }

  get f() {
    return this.editForm.controls;
  }
}
