import { IContactResponse } from './contact-response.model';

export interface IContactWithoutUUID extends Omit<IContactResponse, 'id'> { }
