import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContactEditComponent } from './components/main/contact-edit/contact-edit.component';

const routes: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'add', component: ContactEditComponent },
	{ path: 'edit/:id', component: ContactEditComponent },
	{ path: 'preview/:id', component: ContactEditComponent },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' }

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
