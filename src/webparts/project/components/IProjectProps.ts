import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectProps {
  description: string;
  // products: IProductList[];   // ska innehålla  listan  av mina produkter
  context: WebPartContext;   // hämtar site url i SP dora.doraki
  userNme: string;                //Spara user namnet från context
  siteUrl: string;
}

export interface IProductList {    //  properties av mina produkter
  Id: string;
  Title: string;
  Price: number;
  Product_Category: string;
  ImageUrl:string;
}

export interface IOrders {
  key: string;
  Id: string;
  Title: string;
  Price: number;
  ImageUrl:string;
}
