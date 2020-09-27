import { IContactResponse } from './contact-response.model';

export interface IContact {
	headerLetter: string;
	contacts: IContactResponse[];
}

