import { Pipe, PipeTransform } from '@angular/core';
import { IContact } from '../ts/models/contact.model';
import { ContactService } from '../services/contact.service';

@Pipe({
	name: 'contact'
})
export class ContactPipe implements PipeTransform {

	constructor(
		private contactService: ContactService
	) { }

	transform(contacts: IContact[], userSearchInfo: string): IContact[] {
		return this.contactService.formatPipeContacts(contacts, userSearchInfo);
	}
}
