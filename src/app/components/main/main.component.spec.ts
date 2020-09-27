import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MainComponent } from './main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsLengthPipe } from './pipes/contacts-length.pipe';
import { ContactPipe } from './pipes/contact.pipe';

describe('MainComponent', () => {
	let component: MainComponent;
	let fixture: ComponentFixture<MainComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				MainComponent,
				ContactsLengthPipe,
				ContactPipe
			],
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
