import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { ContactService } from '../../services/contact.service';

export class ContactValidator {

	static contactNameValidator(contactService: ContactService): (control: AbstractControl) => Observable<ValidationErrors> {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return control.valueChanges
				.pipe(
					debounceTime(500),
					distinctUntilChanged(),
					switchMap(value => contactService.checkIfUniqueUsername$(value)),
					take(1),
					tap(_ => contactService.setNewUsernameValidatorState())
				);
		};
	}
}
