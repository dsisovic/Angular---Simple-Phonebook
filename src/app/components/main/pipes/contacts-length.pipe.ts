import { Pipe, PipeTransform } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { IContactData } from '../ts/models/contact.model';

@Pipe({
	name: 'contactsLength'
})
export class ContactsLengthPipe implements PipeTransform {

	constructor(
		private contactService: ContactService
	) { }

	transform(contactsInfo: IContactData[]): number {
		return this.contactService.formatPipeContactsLength(contactsInfo);
	}

}
