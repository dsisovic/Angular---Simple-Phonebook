import { ContactsLengthPipe } from './contacts-length.pipe';

describe('ContactsLengthPipe', () => {
  it('create an instance', () => {
    const pipe = new ContactsLengthPipe();
    expect(pipe).toBeTruthy();
  });
});
