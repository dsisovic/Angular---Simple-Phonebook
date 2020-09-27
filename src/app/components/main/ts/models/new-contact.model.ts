import { IContactResponse } from './contact-response.model';
export interface INewContact extends Omit<IContactResponse, 'id'> {
}
