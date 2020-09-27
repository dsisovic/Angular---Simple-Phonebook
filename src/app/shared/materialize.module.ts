import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [],
	imports: [
		MatChipsModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatTooltipModule
	],
	exports: [
		MatChipsModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatTooltipModule
	]
})
export class MaterializeModule { }
