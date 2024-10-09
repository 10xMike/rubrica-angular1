import { Component } from '@angular/core';
import { ContactComponent } from 'app/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {

}
