import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContactService } from '../services/contact.service';
import { IContactResponse } from '../ts/models/contact-response.model';
import { IContact } from '../ts/models/contact.model';

@Component({
	selector: 'app-contact-item',
	templateUrl: './contact-item.component.html',
	styleUrls: ['./contact-item.component.scss']
})
export class ContactItemComponent implements OnDestroy {

	@Input() contactInfo: IContact;

	selectedContactId: number;

	destroy: Subject<void> = new Subject();

	constructor(
		private router: Router,
		private contactService: ContactService
	) { }

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.complete();
	}

	onDeleteContact(contact: IContactResponse): void {
		const { id, name } = contact;
		const confirmed = confirm(`Are you sure you want to delete contact "${name}"?`);

		if (confirmed) {
			this.contactService.deleteContact$(id)
				.pipe(takeUntil(this.destroy))
				.subscribe(_ => this.contactService.setFetchContactState());
		}
	}

	onEditContact(contactId: string): void {
		this.router.navigateByUrl(`edit/${contactId}`);
	}

	onPreviewContact(contactId: string): void {
		this.router.navigateByUrl(`preview/${contactId}`);
	}

	trackByContactId(_: number, contact: IContactResponse): string {
		return contact.id;
	}

}
