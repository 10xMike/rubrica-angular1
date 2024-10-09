import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import IContactDetails from '@dm/contact-details.model';
import { IContactListItem } from '@dm/contact-list-item.model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  //private selectedContact: IContactDetails | null = null;
  private apiURL = environment.CONTACTS_SERVICE_ENDPOINT;

  constructor(private http: HttpClient) { }

  getContactsList(): Observable<IContactListItem[]> {
    return this.http.get<IContactListItem[]>(`${this.apiURL}/list`);
  }

  getContact(id: string): Observable<IContactDetails> {
    return this.http.get<IContactDetails>(`${this.apiURL}/${id}`)
  }

  createContact(payload: IContactDetails) {
    return this.http.put<IContactDetails>(`${this.apiURL}/`, payload)
  }

  deleteContact(id: number) {
    return this.http.delete<IContactDetails>(`${this.apiURL}/${id}`)
  }

  patchContact(payload: IContactDetails) {
    return this.http.patch<IContactDetails>(`${this.apiURL}`, payload)
  }
}
