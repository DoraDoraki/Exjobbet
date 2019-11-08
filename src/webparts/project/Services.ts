// import {IGetDataService} from './IGetService';  //Vi importerar det  produktlista från projektet,varje component börja med import
import {IProductList} from '../project/components/IProjectProps';
import { sp, Web } from "sp-pnp-js";







//hämtar data från shrapointonline   
export class PNPDataService {
  

    //Ditt promise är uppfyllt med resultatobjekt som passerat för att lösa.
    public getData(url): Promise<IProductList[]> {
        let newWeb = new Web(url);
        return newWeb.lists.getByTitle("Product").items.get().then((result) => {      
            return result;
            });
    } 
}