import './App.css';
import Login from './components/login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import rawstore from './components/rawstore';
import { Fragment } from 'react';
import PrimarySearchAppBar from './components/layout/navbaradmin'
import rawstoreadditem from './components/rawstoreadditem';
import rawstoreoutitem from './components/rawstoreoutitem';
import production from './components/production';
import productionworking from './components/productionworking';
import productionbarcode from './components/productionbarcode';
import qrcode from './components/qrcode';
import barcode from './components/barcodereader';
import products from './components/products';
//import productdisplay from './components/productdisplay';
import qualitycontrol from './components/qualitycontrol';
import adminusers from './components/adminusers';
import admindisplayproducts from './components/admindisplayproducts';
import adminproductdetails from './components/adminproductdetails';
import displayqrcode from './components/displayqrcode';
import stockmanager from './components/stockmanager';
import admingoods from './components/admingoods';
import adminorders from './components/adminorders';
function App() {
  return (
    <div className="App">

      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/barcode" component={barcode} />
          <Route exact path="/displayqrcode" component={displayqrcode} />
          <Fragment>
            <PrimarySearchAppBar />
            <Route exact path="/admin/dashboard" component={admindisplayproducts} />
            <Route exact path="/admin/productdetails" component={adminproductdetails} />
            <Route exact path="/admin/users" component={adminusers} />
            <Route exact path="/admin/goods" component={admingoods} />
            <Route exact path="/admin/orders" component={adminorders} />
            <Route exact path="/rawstore/dashboard" component={rawstore} />
            <Route exact path="/rawstore/additem" component={rawstoreadditem} />
            <Route exact path="/rawstore/outitem" component={rawstoreoutitem} />
            <Route exact path="/production/dashboard" component={production} />
            <Route exact path="/production/working" component={productionworking} />
            <Route exact path="/production/barcode" component={productionbarcode} />
            <Route exact path="/products" component={products} />
            <Route exact path="/quality/dashboard" component={qualitycontrol} />
            <Route exact path="/stock/dashboard" component={stockmanager} />
            <Route exact path="/qrcode" component={qrcode} />

          </Fragment>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
