import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute, RouterOutlet } from '@angular/router';
import { IContactListItem } from '@dm/contact-list-item.model';
import { ContactDetailComponent } from 'app/contact-detail/contact-detail.component';
import { ContactsService } from 'app/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactDetailComponent, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  contacts: IContactListItem[] = [];
  filteredContacts: IContactListItem[] = [];
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string = "";

  constructor(private contactsService: ContactsService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactsService.getContactsList()
      .subscribe((data: IContactListItem[]) => {
        this.contacts = data;
        this.filteredContacts = data;
        this.cdr.markForCheck();
      });
  }

  filterByLetter(letter: string): void {
    this.selectedLetter = this.selectedLetter === letter ? "" : letter;
    this.filteredContacts = this.selectedLetter
    ? this.contacts.filter(contact => contact.alias.toUpperCase().startsWith(this.selectedLetter))
    : [...this.contacts];
  }

  addContact() {
    this.router.navigate(['/contact-detail']);
  }

  deleteContact(contactId: number): void {
    if (confirm('Sei sicuro di voler eliminare questo contatto?')) {
      this.contactsService.deleteContact(contactId).subscribe({
        next: () => {
          console.log('Contatto eliminato con successo');
          this.loadContacts(); // Ricarica la lista dei contatti
        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione del contatto', error);
        }
      });
    }
  }
}
