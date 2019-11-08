import * as React from 'react';
import styles from './Project.module.scss';
import { IProjectProps, IProductList, IOrders } from './IProjectProps';
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import { sp } from 'sp-pnp-js';
import * as moment from 'moment';
import { PNPDataService } from '../Services';

export interface ISporState {
  items: IProductList[];
  orderItems: IOrders[];
  Id: string;
  Title: string;
  Price: number;
  Category: string;
  ImageUrl: string;
  imageUrlDesc: string;
  mouseOver: boolean;
  showModal: boolean;
  totalItem: number;
  totalPrice: number;

}

export default class Project extends React.Component<IProjectProps, ISporState> {
  constructor(props: IProjectProps) {
    super(props);

    this.state = {
      items: [],
      orderItems: [],
      mouseOver: false,
      showModal: false,
      Id: '',
      Title: '',
      Price: 0,
      Category: '',
      ImageUrl: '',
      imageUrlDesc: '',
      totalItem: 0,
      totalPrice: 0
    };

  }

  componentDidMount() {
    let service = new PNPDataService();
    service.getData(this.props.siteUrl).then(items => {
      this.setState({ items: items });
      console.log(items);
    })
  }

  // Method to add orders and save to state
  private AddOrder = (id: string, title: string, price: number, imageUrl: string) => {
    // this.setState({ showModal: !this.state.showModal });
    this.setState({ totalItem: this.state.totalItem + 1, totalPrice: this.state.totalPrice + price }); // Add total price
    this.setState(prev => ({   // Sparar product i array state som innehåller alla properties
      orderItems: [...prev.orderItems, {
        key: new Date().toJSON(),
        Id: id,
        Title: title,
        Price: price,
        ImageUrl: imageUrl
      }]
    }));

    //console.log(this.state.orderItems);
  }


  //Toggle Modal
  private modalToggle = () => {
    this.setState({ showModal: !this.state.showModal });
  }


  //Order Method
  private order = () => {
    this.modalToggle();
  }



  // Method to remove/cancel order and update the state
  private CancelOrderHandler(index, price) {
    const myList = [...this.state.orderItems];  // en kopia av state orderItems
    myList.splice(index, 1); //tar bort ett element i en array orderItems state

    this.setState({ orderItems: myList, totalPrice: this.state.totalPrice - price }); //calculate total price to remove 1 order
  }



  // save all data Method 
  private ProceedToCheckout() {

    let date = moment().format('LL');
    const userName = this.props.userNme;
    let totalPrice = this.state.totalPrice;

    //Loopagenom produkter som har beställt och spara i listan i SP via methos "saveOrerItemds"
    this.state.orderItems.forEach(element => {
      this.saveOrderItems(element.Title, date, element.Price, userName);
    });
    this.setState({ orderItems: [] });

    // save customer name and total price to List in SP
    sp.web.lists.getByTitle("OrderList").items.add({
      Title: userName,
      TotalPrice: totalPrice
    });
  }

  ///Save Order Data to SP
  public saveOrderItems(title, date, pris, userName) {
    this.modalToggle();
    // save ordered products to list
    sp.web.lists.getByTitle("Order%20Items").items.add({
      Title: title,
      Date: date,
      Price: pris,
      CustomerName: userName
    });

  }



  public render(): React.ReactElement<IProjectProps> {

    let items = [];
    items = this.state.items.map((item) => {
      return (  //loopar alla produkter i listan från sharepoint och sparar dem i variable items
        <div className={styles.tile} key={item.Id}>
          <div className={styles.ProductItemContainer}>
            <div className={styles.ProductItem} >
              <img className={styles.Images}
                src={item.ImageUrl}
                alt={item.Title}
              />
              <div className={styles.Price}>{item.Price} kr</div>
            </div>
            <div className={styles.ProductInfo}>
              <div>{item.Title}</div>

            </div>

          </div>
          <div onClick={this.AddOrder.bind(this, item.Id, item.Title, item.Price, item.ImageUrl)}
            style={{ borderRadius: "12px", padding: "3px 6px", margin: "25px", cursor: "pointer", border: "1px solid black" }}>Add to basket</div>
        </div>
      );
    });

    // Loopar alla produkter som har beställt
    let ids = new Date().toJSON;
    let orders = [];
    orders = this.state.orderItems.map((item, index) => {
      return (
        <div className={styles.OrderItem} key={item.key + ids + item.Id}>
          <div className={styles.CancelOrder}
            onClick={this.CancelOrderHandler.bind(this, index, item.Price)}
          >Cancel</div>
          <li className={styles.Card} >
            <div className={styles.CardItem}>
              <img
                className={styles.CardImage} src={item.ImageUrl}
                alt="Pic" />
            </div>
            <div className={styles.CardItem}>
              <div className={styles.CardInfo}>
                <h3>{item.Title}</h3>
                <p>{item.Price} kr</p>
              </div>
            </div>
          </li>
        </div>
      );
    });



    return ( // BrowserRouter som undviker att refesha,React Router och dynamisk routing på kundsidan gör det möjligt för oss att bygga ett enkelsidigt webbprogram med navigering utan att sidan uppdateras när användaren navigerar.
      <BrowserRouter>
        <div className={styles.project}>

          <header className={styles.Toolbar}>
            <nav className={styles.DesktopOnly}>
              <ul className={styles.NavigationItems}>
                <li className={styles.NavigationItem}>
                  <NavLink to={{pathname: "/sites/Developersite/_layouts/15/workbench.aspx"}}  // NavLink that works like a HTML "a" tag
                    exact
                    activeClassName="my-active"
                    activeStyle={{
                      color: 'black',
                      backgroundColor: 'white',
                      borderBottom: '4px solid #40A4C8',
                      margin: '0 5px'
                    }}>Home</NavLink>
                </li>
                <li className={styles.NavigationItem}>
                  {/* {shoppingCart} */}
                  <NavLink to={"/sites/Developersite/_layouts/15/workbench.aspx/checkout"}
                    activeClassName="my-active"
                    activeStyle={{
                      color: 'black',
                      backgroundColor: 'white',
                      borderBottom: '4px solid #40A4C8',
                      margin: '0 5px'
                    }}>

                    {<img className={styles.Cart} src={require('shopping-bag.png')} alt="Basket" />}


                    {/* controlerar om det finns produkt som har valt att köpa */}
                    {this.state.totalItem >= 1 ? <div className={styles.TotalItems}>{this.state.orderItems.length}</div> : null}

                  </NavLink>
                </li>
              </ul>
            </nav>
          </header>


          <div className={styles.BandName}>SPORT.NU</div>


          <Switch // To Switch mellan sidorna    // Navigation Items
          >

            <Route path={"/sites/Developersite/_layouts/15/workbench.aspx"} exact  // Route to navigate pages  //Home Page Item
              render={() => <div className={styles.ProductContainer}>
                {items}
              </div>}
            />

            <Route path={"/sites/Developersite/_layouts/15/workbench.aspx/checkout"}  // Min shopping cart Sida
              render={() => <div>
                {/* {pop up modal}    */}
                {this.state.showModal ? <div>
                  <div className={styles.Backdrop} onClick={this.modalToggle}></div>
                  <div className={styles.Modal}>
                    <div className={styles.ProductContainer}>
                      <div className={styles.ProductInfo}>
                        <div className={styles.ProductInfoElement}>Thank you for your order!</div>
                      </div>
                    </div>
                    <div className={styles.AddItemButton}>
                      <div onClick={this.modalToggle}>Cancel</div>
                      <div
                        onClick={this.ProceedToCheckout.bind(this)}
                      >Send order</div>
                    </div>
                  </div>
                </div> : null}


                <h3 style={{ paddingLeft: "30px" }}> Check Out</h3>

                {/* {controlera om det finns nåra produkter som har valt att köpa annars visa ingenting i skarrmen} */}
                {this.state.orderItems.length > 0 ? <div>
                  <ul className={styles.Cards}>
                    {orders}
                  </ul>
                  <div
                    className={styles.TotalPrice}>Total Price: {this.state.totalPrice} Sek</div>
                  <div className={styles.Buy} onClick={this.order.bind(this)}>Order</div>
                </div> : null}
              </div>}
            />


          </Switch>

        </div>
      </BrowserRouter>
    );
  }
}
