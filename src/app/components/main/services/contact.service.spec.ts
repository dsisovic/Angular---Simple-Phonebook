import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactService } from './contact.service';

describe('ContactService', () => {
	let service: ContactService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule
			]
		});
		service = TestBed.inject(ContactService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
