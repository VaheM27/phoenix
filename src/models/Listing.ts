export default interface Listing {
  postTitle: string;
  brand: string;
  phoneColor: string;
  phoneModel: string;
  phoneStorage: string;
  phoneCondition: string;
  description: string;
  contactNumber: string;
  askingPrice: number | string;
  distance?: string;
  pictures?: string[];
  createdAt?: Date;
}
