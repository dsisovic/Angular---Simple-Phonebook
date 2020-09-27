import { Pipe, PipeTransform } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { IContact } from '../ts/models/contact.model';

@Pipe({
	name: 'contactsLength'
})
export class ContactsLengthPipe implements PipeTransform {

	constructor(
		private contactService: ContactService
	) { }

	transform(contactsInfo: IContact[]): number {
		return this.contactService.formatPipeContactsLength(contactsInfo);
	}

}
