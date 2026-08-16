import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';

export const routes: Routes = [
  { path: '', component: TripListingComponent, title: 'Trips | Travlr Admin' },
  { path: 'login', component: LoginComponent, title: 'Login | Travlr Admin' },
  {
    path: 'add-trip',
    component: AddTripComponent,
    canActivate: [authGuard],
    title: 'Add Trip | Travlr Admin'
  },
  {
    path: 'edit-trip/:tripCode',
    component: EditTripComponent,
    canActivate: [authGuard],
    title: 'Edit Trip | Travlr Admin'
  },
  { path: '**', redirectTo: '' }
];
