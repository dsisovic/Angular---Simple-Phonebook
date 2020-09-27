import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IContactResponse } from '../ts/models/contact-response.model';
import { IContactData } from '../ts/models/contact.model';
import { INewContact } from '../ts/models/new-contact.model';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ContactService {

	private addContactUrl: string = environment.apiUrl + '/post';
	private editContactUrl: string = environment.apiUrl + '/put';
	private fetchContactsUrl: string = environment.apiUrl + '/get';
	private deleteContactUrl: string = environment.apiUrl + '/delete';

	private fetchContactState: BehaviorSubject<boolean> = new BehaviorSubject(true);
	private markUsernameValidatorState: BehaviorSubject<void> = new BehaviorSubject(null);

	constructor(
		private router: Router,
		private http: HttpClient,
		private formBuilder: FormBuilder
	) { }

	// HTTP

	fetchContacts$(): Observable<IContactData[]> {
		return this.http.get<IContactResponse[]>(this.fetchContactsUrl)
			.pipe(
				map(contacts => this.formatContactsResponse(contacts)),
				catchError(_ => of([]))
			);
	}

	fetchContactById$(contactId: string): Observable<IContactResponse> {
		return this.http.get<IContactResponse[]>(this.fetchContactsUrl + `/${contactId}`)
			.pipe(
				map((contacts: IContactResponse[]) => contacts[0]),
				catchError(_ => {
					this.router.navigateByUrl('');
					return EMPTY;
				})
			);
	}

	addContact$(contact: INewContact): Observable<IContactResponse[]> {
		return this.http.post<IContactResponse[]>(this.addContactUrl, contact);
	}

	editContact$(contact: IContactResponse): Observable<IContactResponse[]> {
		return this.http.put<IContactResponse[]>(this.editContactUrl, contact);
	}

	deleteContact$(contactId: string): Observable<IContactResponse[]> {
		return this.http.delete<IContactResponse[]>(this.deleteContactUrl + `/${contactId}`);
	}

	checkIfUniqueUsername$(username: string): Observable<ValidationErrors | null> {
		return this.http.get<IContactResponse[]>(this.fetchContactsUrl)
			.pipe(
				map(contacts => {
					const contactMatches = contacts.some(contact => contact.name === username);
					return contactMatches ? { duplicatedUsername: true } : null;
				})
			);
	}

	// LOGIC

	formatContactsResponse(contacts: IContactResponse[]): IContactData[] {
		return contacts
			.reduce((accumulator, contact) => {
				const contactFirstLetter = contact.name.charAt(0);
				return accumulator.includes(contactFirstLetter) ? accumulator : [...accumulator, contactFirstLetter];
			}, [])
			.slice()
			.sort()
			.map(contactFirstLetter => {
				const matchingContacts = contacts.filter(contact => contact.name.charAt(0) === contactFirstLetter);
				return { headerLetter: contactFirstLetter, contacts: matchingContacts };
			});
	}

	formatPipeContacts(contactsInfo: IContactData[], userSearchInfo: string): IContactData[] {
		if (userSearchInfo) {
			return contactsInfo.reduce((accumulator, contactInfo) => {
				const { contacts, headerLetter } = contactInfo;
				const matchingContacts = this.getMatchingContacts(contacts, userSearchInfo.toLocaleLowerCase());
				return matchingContacts.length ? [...accumulator, { headerLetter, contacts: matchingContacts }] : accumulator;
			}, []);
		}
		return contactsInfo;
	}

	formatPipeContactsLength(contactsInfo: IContactData[]): number {
		if (contactsInfo) {
			return contactsInfo
				.map(contactInfo => contactInfo.contacts.length)
				.reduce((accumulator, numberOfContacts) => accumulator + numberOfContacts, 0);
		}
		return 0;
	}

	getMatchingContacts(contacts: IContactResponse[], userSearchInfo: string): IContactResponse[] {
		return contacts.filter(contact => {
			const { name, number: contactNumber } = contact;
			return name.toLocaleLowerCase().includes(userSearchInfo) || contactNumber.toLocaleLowerCase().includes(userSearchInfo);
		});
	}

	setFetchContactState(): void {
		this.fetchContactState.next(true);
	}

	getFetchContactState$(): Observable<IContactData[]> {
		return this.fetchContactState.asObservable()
			.pipe(
				switchMap(_ => this.fetchContacts$()),
				shareReplay()
			);
	}

	buildContactForm(): FormGroup {
		return this.formBuilder.group({
			name: ['', [Validators.required]],
			number: ['', [Validators.required]],
			email: ['', [Validators.email]],
			tags: this.formBuilder.array([])
		});
	}

	setNewUsernameValidatorState(): void {
		this.markUsernameValidatorState.next();
	}

	getNewUsernameValidatorState$(): Observable<void> {
		return this.markUsernameValidatorState.asObservable();
	}
}
