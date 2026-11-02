export interface Customer {
  id: string;
  code: number;
  registrationDate: string;
  name: string;
  phone: string;
  address: string;
  gpsUrl?: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  address: string;
  gpsUrl?: string;
}
