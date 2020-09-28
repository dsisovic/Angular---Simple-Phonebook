import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContactService } from '../services/contact.service';
import { IContactResponse } from '../ts/models/contact-response.model';
import { ContactValidator } from './validators/contact.validators';
@Component({
	selector: 'app-contact-edit',
	templateUrl: './contact-edit.component.html',
	styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit, OnDestroy {

	isAddMode = false;
	isEditMode = false;
	isPreviewMode = false;

	isLoading = true;
	contactFormChanged = false;

	tagIndex: number;
	contactId: string;
	contactName: string;

	contactForm: FormGroup;
	initialContactForm: FormGroup;

	destroy: Subject<void> = new Subject();

	constructor(
		private router: Router,
		private cdRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private contactService: ContactService
	) { }

	ngOnInit(): void {
		this.setRouterState();
		this.setUiFormState();
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.complete();
	}

	onSaveContact(): void {
		// tslint:disable-next-line: max-line-length
		const savePayload$ = this.isAddMode ? this.contactService.addContact$(this.contactForm.value) : this.contactService.editContact$({ ...this.contactForm.value, id: this.contactId });

		savePayload$
			.pipe(takeUntil(this.destroy))
			.subscribe(_ => this.router.navigateByUrl(''));
	}

	setRouterState(): void {
		this.isEditMode = this.router.url.includes('edit');
		this.isPreviewMode = this.router.url.includes('preview');
		this.isAddMode = !this.isEditMode && !this.isPreviewMode;
	}

	setUiFormState(): void {
		this.contactForm = this.contactService.buildContactForm();
		this.initialContactForm = this.contactService.buildContactForm();

		if (this.isEditMode) {
			this.fetchSelectedContactById(false);
			this.watchUsernameValidatorChange();
			this.watchContactFormChanges();
		} else if (this.isPreviewMode) {
			this.fetchSelectedContactById(true);
			this.watchUsernameValidatorChange();
			this.contactFormChanged = true;
		} else if (this.isAddMode) {
			this.setUsernameValidator();
			this.isLoading = false;
			this.contactFormChanged = true;
		}
	}

	fetchSelectedContactById(disabledForm: boolean): void {
		this.contactId = this.activatedRoute.snapshot.paramMap.get('id');

		this.contactService.fetchContactById$(this.contactId)
			.pipe(takeUntil(this.destroy))
			.subscribe(selectedContact => {
				this.updateContactForms(selectedContact);
				this.setFormDisabledState(disabledForm);
				this.setUsernameValidator(selectedContact);
				this.contactName = selectedContact.name;
				this.isLoading = false;

				this.cdRef.markForCheck();
			});
	}

	// function to resolve async username validator bug
	watchUsernameValidatorChange(): void {
		this.contactService.getNewUsernameValidatorState$()
			.pipe(takeUntil(this.destroy))
			.subscribe(_ => this.cdRef.markForCheck());
	}

	watchContactFormChanges(): void {
		this.contactForm.valueChanges
			.pipe(takeUntil(this.destroy))
			.subscribe(contactFormValue => {
				this.contactFormChanged = JSON.stringify(contactFormValue) !== JSON.stringify(this.initialContactForm.value);
			});
	}

	setUsernameValidator(selectedContact?: IContactResponse): void {
		if (!this.isPreviewMode) {
			const uniqueNameValidator = ContactValidator.contactNameValidator(this.contactService, selectedContact);
			this.contactForm.get('name').setAsyncValidators(uniqueNameValidator);
			this.updateContactName();
		}
	}

	updateContactForms(selectedContact: IContactResponse): void {
		const { name, number: contactNumber, email, tags } = selectedContact;
		this.contactForm.patchValue({ name, number: contactNumber, email });
		this.initialContactForm.patchValue(this.contactForm.value);

		tags.forEach(tag => {
			this.tags.push(new FormControl(tag));
			this.initialTags.push(new FormControl(tag));
		});
	}

	setFormDisabledState(disabled: boolean): void {
		if (disabled) {
			this.contactForm.get('name').disable();
			this.contactForm.get('number').disable();
			this.contactForm.get('email').disable();
			this.tags.controls.forEach(tagControl => tagControl.disable());
		}
	}

	updateContactName(): void {
		setTimeout(() => {
			this.contactForm.patchValue({ name: this.contactForm.value.name });
		}, 0);
	}

	onAddTag(): void {
		this.tags.push(new FormControl('', [Validators.required]));
	}

	onRemoveTag(tagIndex: number): void {
		this.tags.removeAt(tagIndex);
	}

	onGoBack(): void {
		this.router.navigateByUrl('');
	}

	get tags(): FormArray {
		return this.contactForm.get('tags') as FormArray;
	}

	get initialTags(): FormArray {
		return this.initialContactForm.get('tags') as FormArray;
	}
}
