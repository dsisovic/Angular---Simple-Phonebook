import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactService } from '../services/contact.service';
import { ContactsLengthPipe } from './contacts-length.pipe';

describe('ContactsLengthPipe', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContactsLengthPipe],
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();
	});


	it('create an instance', () => {
		const contactService = TestBed.inject(ContactService);

		const pipe = new ContactsLengthPipe(contactService);
		expect(pipe).toBeTruthy();
	});
});
