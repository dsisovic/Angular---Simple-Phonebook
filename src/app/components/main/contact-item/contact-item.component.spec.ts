import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactItemComponent } from './contact-item.component';

describe('ContactItemComponent', () => {
	let component: ContactItemComponent;
	let fixture: ComponentFixture<ContactItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContactItemComponent],
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactItemComponent);
		component = fixture.componentInstance;

		component.contactInfo = { headerLetter: 'A', contacts: [] };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
