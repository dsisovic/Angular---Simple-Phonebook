import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ContactService } from './services/contact.service';
import { IContact } from './ts/models/contact.model';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	contactsInfo$: Observable<IContact[]>;

	destroy: Subject<void> = new Subject();

	constructor(
		private router: Router,
		private contactService: ContactService
	) { }

	ngOnInit(): void {
		this.watchFetchContactsInfo();
	}

	watchFetchContactsInfo(): void {
		this.contactsInfo$ = this.contactService.getFetchContactState$();
	}

	onAddContact(): void {
		this.router.navigateByUrl('/add');
	}
}
