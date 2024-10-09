import { Routes } from '@angular/router';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'contacts', component: ContactComponent },
    { path: 'contact-detail', component: ContactDetailComponent },
    { path: '', redirectTo: '/home', pathMatch: 'prefix' }
    /* { path: 'contatti/:id', component: ContactComponent } */
];

