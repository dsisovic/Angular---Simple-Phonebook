import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactService } from '../services/contact.service';
import { ContactPipe } from './contact.pipe';

describe('ContactPipe', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContactPipe],
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

		const pipe = new ContactPipe(contactService);
		expect(pipe).toBeTruthy();
	});
});
