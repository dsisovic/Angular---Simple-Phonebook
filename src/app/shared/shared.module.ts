import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from './materialize.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MaterializeModule
	],
	exports: [
		CommonModule,
		MaterializeModule
	]
})
export class SharedModule { }
