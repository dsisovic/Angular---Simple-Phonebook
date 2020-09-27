import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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

	tagIndex: number;
	contactId: string;

	contactForm: FormGroup;

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

	onAddTag(): void {
		this.tags.push(new FormControl(''));
	}

	onRemoveTag(tagIndex: number): void {
		this.tags.removeAt(tagIndex);
	}

	onSaveContact(): void {
		// tslint:disable-next-line: max-line-length
		const savePayload$ = this.isAddMode ? this.contactService.addContact$(this.contactForm.value) : this.contactService.editContact$({ ...this.contactForm.value, id: this.contactId });

		savePayload$
			.pipe(takeUntil(this.destroy))
			.subscribe(_ => this.router.navigateByUrl(''));
	}

	onGoBack(): void {
		this.router.navigateByUrl('');
	}

	setRouterState(): void {
		this.isEditMode = this.router.url.includes('edit');
		this.isPreviewMode = this.router.url.includes('preview');
		this.isAddMode = !this.isEditMode && !this.isPreviewMode;
	}

	setUiFormState(): void {
		this.contactForm = this.contactService.buildContactForm();
		// 1: edit contact mode
		// 2: add contact mode
		// 3: preview contact (readonly) mode
		if (this.isEditMode) {
			this.fetchSelectedContactById(false);
			this.watchUsernameValidatorChange();
		} else if (this.isPreviewMode) {
			this.fetchSelectedContactById(true);
			this.watchUsernameValidatorChange();
		} else if (this.isAddMode) {
			this.setUsernameValidator();
			this.isLoading = false;
		}
	}

	fetchSelectedContactById(disabledForm: boolean): void {
		this.contactId = this.activatedRoute.snapshot.paramMap.get('id');

		this.contactService.fetchContactById$(this.contactId)
			.pipe(takeUntil(this.destroy))
			.subscribe(selectedContact => {
				this.updateContactForm(selectedContact);
				this.setFormDisabledState(disabledForm);
				this.setUsernameValidator(selectedContact);
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

	setUsernameValidator(selectedContact?: IContactResponse): void {
		if (!this.isPreviewMode) {
			const uniqueNameValidator = ContactValidator.contactNameValidator(this.contactService);
			this.contactForm.get('name').setAsyncValidators(uniqueNameValidator);

			if (selectedContact) {
				setTimeout(() => {
					this.contactForm.patchValue({ name: selectedContact.name });
				}, 0);
			}
		}
	}

	updateContactForm(selectedContact: IContactResponse): void {
		const { name, number: contactNumber, email, tags } = selectedContact;

		this.contactForm.patchValue({ name, number: contactNumber, email });
		tags.forEach(tag => this.tags.push(new FormControl(tag)));
	}

	setFormDisabledState(disabled: boolean): void {
		if (disabled) {
			this.contactForm.get('name').disable();
			this.contactForm.get('number').disable();
			this.contactForm.get('email').disable();
			this.tags.controls.forEach(tagControl => tagControl.disable());
		}
	}

	get tags(): FormArray {
		return this.contactForm.get('tags') as FormArray;
	}
}
