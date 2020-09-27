import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactItemComponent } from './main/contact-item/contact-item.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactPipe } from './main/pipes/contact.pipe';
import { ContactEditComponent } from './main/contact-edit/contact-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsLengthPipe } from './main/pipes/contacts-length.pipe';

@NgModule({
	declarations: [
		MainComponent,
		NotFoundComponent,
		ContactItemComponent,
		ContactPipe,
		ContactEditComponent,
		ContactsLengthPipe
	],
	imports: [
		SharedModule,
		HttpClientModule,
		ReactiveFormsModule
	]
})
export class MainModule { }
