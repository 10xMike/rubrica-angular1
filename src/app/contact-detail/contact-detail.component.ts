import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from 'app/services/contact.service';
import { Router, ActivatedRoute } from '@angular/router';
import IContactDetails from '@dm/contact-details.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.less',
})
export class ContactDetailComponent implements OnInit {
  contact!: IContactDetails;
  contactForm: FormGroup;
  isEditing = false;


  constructor(
    private contactsService: ContactsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.contactForm = new FormGroup({
      alias: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', [Validators.required])
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.contactForm.enable();
    } else {
      this.contactForm.disable();
    }
  }

  deleteContact(): void {
    // Verifica se il contatto è definito
    if (!this.contact || this.contact.id === undefined) {
      console.error('Contatto non definito o ID mancante');
      return;
    }
  
    // Conferma l'eliminazione
    if (confirm('Sei sicuro di voler eliminare questo contatto?')) {
      this.contactsService.deleteContact(this.contact.id).subscribe({
        next: () => {
          console.log('Contatto eliminato con successo');
          // Mostra un messaggio di conferma o feedback all'utente
          alert('Contatto eliminato con successo!');
          this.router.navigate(['/']);  // Dopo l'eliminazione, torna alla home
        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione del contatto:', error);
          // Mostra un messaggio di errore all'utente
          alert('Si è verificato un errore durante l\'eliminazione del contatto. Riprova più tardi.');
        }
      });
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params['id'];
      console.log('ID ricevuto:', id);
      if (id) {
        this.loadContact(id);
      }
    });
  }

  loadContact(id: string) {
    this.contactsService.getContact((id)).subscribe(contact => {
      console.log('Contatto ricevuto:', contact);
      this.contact = contact;
      this.contactForm.patchValue(contact);
    }, error => {
      console.error('Errore nel caricamento del contatto:', error);
    });
  }

  saveContact() {
    if (this.contactForm.invalid) {
      return;
    }

    const contactData: IContactDetails = {
      alias: this.contactForm.value.alias ?? '',
      email: this.contactForm.value.email ?? '',
      phoneNo: this.contactForm.value.phoneNo ?? '',
      lastName: '',
      firstName: ''
    };

    if (this.contact) {
      this.contactsService.patchContact({ ...this.contact, ...contactData }).subscribe({
        next: (response: any) => {
          console.log('Contatto aggiornato con successo', response);
          this.contact = response;
          this.disableForm();
        },
        error: (error: any) => {
          console.error('Errore nell\'aggiornamento del contatto', error);
        }
      });
    } else {
      this.contactsService.createContact(contactData).subscribe({
        next: (response: any) => {
          console.log('Contatto salvato con successo', response);
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error('Errore nel salvataggio del contatto', error);
        }
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  private disableForm(): void {
    this.contactForm.disable();
  }
}