import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactEditComponent } from './contact-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactEditComponent', () => {
	let component: ContactEditComponent;
	let fixture: ComponentFixture<ContactEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContactEditComponent],
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
