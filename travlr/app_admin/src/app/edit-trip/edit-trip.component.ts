import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  editForm!: FormGroup;
  loading = true;
  saving = false;
  submitted = false;
  errorMessage = '';
  tripCode = '';

  constructor(
    private formBuilder: FormBuilder,
    private tripDataService: TripDataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tripCode = this.route.snapshot.paramMap.get('tripCode') || '';

    this.editForm = this.formBuilder.group({
      code: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.tripCode) {
      this.getTrip();
    } else {
      this.errorMessage = 'No trip code provided.';
      this.loading = false;
    }
  }

  // Getter for easy access to form fields in template (e.g. f['name'])
  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  getTrip(): void {
    this.loading = true;
    this.errorMessage = '';

    this.tripDataService.getTrip(this.tripCode).subscribe({
      next: (data: any) => {
        const trip = Array.isArray(data) ? data[0] : data;

        if (!trip) {
          this.errorMessage = 'Trip record not found.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        let formattedDate = trip.start;
        if (trip.start) {
          const dateObj = new Date(trip.start);
          formattedDate = !isNaN(dateObj.getTime())
            ? dateObj.toISOString().split('T')[0]
            : trip.start;
        }

        this.editForm.patchValue({
          code: trip.code,
          name: trip.name,
          length: trip.length,
          start: formattedDate,
          resort: trip.resort,
          perPerson: trip.perPerson,
          image: trip.image,
          description: trip.description
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load trip details from server.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    this.saving = true;

    const updatedTrip = {
      ...this.editForm.getRawValue()
    };

    // Pass both tripCode and updatedTrip to match service signature
    this.tripDataService.updateTrip(this.tripCode, updatedTrip).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/trips'], {
          queryParams: { updated: this.tripCode }
        });
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.errorMessage = 'Failed to update trip. Please try again.';
      }
    });
  }
}