import React, { Component } from 'react';
import './main.css'
import classes from './button.css';

class Main extends Component {


  
  render() {
    console.log("inside main")
    console.log(this.props.balance)

    return (
      <div id="content" className="content">
        <h2>Token Balace :  { this.props.balance/100}</h2>
        <p>&nbsp;</p>
        <h2>Send Infy Token</h2>
        <section className="table-content">
          <form class="form-inline" onSubmit={(event) => {
            event.preventDefault()
            const toAddress = this.toAddress.value
            const price = window.web3.utils.toWei(this.amount.value.toString(), 'Ether')
            this.props.transferFrom(this.props.account, toAddress, price/10000000000000000)
          }}>
            <label for="toAddress">To Address:</label>
                <input type="text" placeholder="address"  ref={(input) => { this.toAddress = input }}
                    required="" id="toAddress" />
                <label for="amount">Amount:</label>
                  <input type="text" placeholder="Amount" 
                      required="" ref={(input) => { this.amount = input }} id="amount" />
                <button type="submit">Send Token</button>
          </form> 
          </section>   

        <p>&nbsp;</p> 
        <h2>Add Product</h2>
        <section className="table-content">
          <form class="form-inline" onSubmit={(event) => {
            event.preventDefault()
            const name = this.productName.value
            const price = window.web3.utils.toWei((this.productPrice.value/100).toString(), 'Ether')
            this.props.createProduct(name, price)
          }}>
            <label for="productName">Product Name:</label>
                  <input type="text" placeholder="ProductName"  ref={(input) => { this.productName = input }}
                      required="" id="productName" />
                  <label for="productPrice">Product Price:</label>
                  <input type="text" placeholder="Product Price" 
                      required="" ref={(input) => { this.productPrice = input }} id="productPrice" />
                  <button type="submit">Add Product</button>
          </form>           
        </section>
        
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <div>
                <table className='styled-table'>

                    <thead>
                        <tr>
                            <th> # </th>
                            <th> Name</th>
                            <th> Price </th>
                            <th> Owner </th>
                            <th>Buy</th>
                        </tr>

                    </thead>
                    <tbody>

                    { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei((product.price).toString(), 'Ether')*1000000} Infy</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button className="button-green"
                          name={product.id}
                          value={product.price*1000000}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : <div className="button-red" >Sold</div>
                    }
                    </td>
                </tr>
              )
            })}
                    </tbody>
                </table>
        </div>
        <p>&nbsp;</p>
        <h2>Purchased Product</h2>
        <div>

        <table className='styled-table'> 
          <thead>
            <tr>
                <th> # </th>
                <th> Name</th>
                <th> Price </th>
                <th>Buyer id</th>
            </tr>
          </thead>
          <tbody id="productList">
          { this.props.products.map((product, key) => {
              if(product.purchased && product.owner===this.props.account){
                return(
                      <tr key={key}>
                      <th scope="row">{product.id.toString()}</th>
                      <td>{product.name}</td>
                      <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Infy</td>
                      <td>{product.owner.toString()} </td>
                      </tr>
                )
              }
            })}
          </tbody>
        </table>
        </div>
      </div>
    );
  }
}

export default Main;
