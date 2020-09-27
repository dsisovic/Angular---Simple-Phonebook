import { Pipe, PipeTransform } from '@angular/core';
import { IContactData } from '../ts/models/contact.model';
import { ContactService } from '../services/contact.service';
@Pipe({
	name: 'contact'
})
export class ContactPipe implements PipeTransform {

	constructor(
		private contactService: ContactService
	) { }

	transform(contacts: IContactData[], userSearchInfo: string): IContactData[] {
		return this.contactService.formatPipeContacts(contacts, userSearchInfo);
	}
}
