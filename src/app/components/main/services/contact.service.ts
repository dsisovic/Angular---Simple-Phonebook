import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, from, Observable, of } from 'rxjs';
import { IContactResponse } from '../ts/models/contact-response.model';
import { IContactData } from '../ts/models/contact.model';
import { IContactWithoutUUID } from '../ts/models/contact-no-uuid';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
	providedIn: 'root'
})
export class ContactService {

	private readonly firebaseCollection = 'contacts';

	private fetchContactState: BehaviorSubject<boolean> = new BehaviorSubject(true);
	private markUsernameValidatorState: BehaviorSubject<void> = new BehaviorSubject(null);

	constructor(
		private router: Router,
		private http: HttpClient,
		private formBuilder: FormBuilder,
		private firestoreService: AngularFirestore
	) { }

	// HTTP

	fetchContacts$(): Observable<IContactData[]> {
		return this.fetchFirebaseContacts$()
			.pipe(
				map(contacts => this.formatContactsResponse(contacts))
			);
	}

	fetchFirebaseContacts$(): Observable<IContactResponse[]> {
		return this.firestoreService.collection(this.firebaseCollection).snapshotChanges()
			.pipe(
				map(response => response.map(entry => ({ id: entry.payload.doc.id, ...entry.payload.doc.data() as IContactWithoutUUID }))),
				catchError(_ => of([]))
			);
	}

	fetchContactById$(contactId: string): Observable<IContactResponse> {
		return from(this.firestoreService.collection(this.firebaseCollection).doc(contactId).valueChanges())
			.pipe(
				map((contact: IContactWithoutUUID) => ({ id: contactId, ...contact })),
				catchError(_ => {
					this.router.navigateByUrl('');
					return EMPTY;
				})
			);
	}

	addContact$(contact: IContactWithoutUUID): Observable<null> {
		return from(this.firestoreService.collection(this.firebaseCollection).add(contact))
			.pipe(
				map(_ => null)
			);
	}

	editContact$(contact: IContactResponse): Observable<null> {
		return from(this.firestoreService.doc(this.firebaseCollection + `/${contact.id}`).update(contact))
			.pipe(
				map(_ => null)
			);
	}

	deleteContact$(contactId: string): Observable<IContactResponse[]> {
		return from(this.firestoreService.doc(this.firebaseCollection + `/${contactId}`).delete())
			.pipe(
				map(_ => null)
			);
	}

	checkIfUniqueUsername$(username: string, selectedContact?: IContactResponse): Observable<ValidationErrors | null> {
		return this.fetchFirebaseContacts$()
			.pipe(
				map(contacts => {
					let contactMatches: boolean;

					if (selectedContact) {
						contactMatches = contacts.some(contact => contact.name === username && selectedContact.name !== username);
					} else {
						contactMatches = contacts.some(contact => contact.name === username);
					}
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
