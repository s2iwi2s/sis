import { IOrg, NewOrg } from './org.model';

export const sampleWithRequiredData: IOrg = {
  id: 20616,
};

export const sampleWithPartialData: IOrg = {
  id: 32417,
  address: 'what driving',
};

export const sampleWithFullData: IOrg = {
  id: 4094,
  name: 'exactly',
  logo: 'psst whether',
  address: 'what hm brim',
};

export const sampleWithNewData: NewOrg = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
