import React, { useState } from 'react';
function AddStock(props) {
    const [message, setMessage] = useState("This will display my message");
    const [price, setPrice] = useState(""); // This will to set the price
    const {addStockFunc, tickerName} = props;
    return (
        <div className="addStockBox">
            <input className='inputPrice' placeholder="Notify Price" type='number' value={price} onChange={(e) => setPrice(e.target.value)}/>
            {console.log(tickerName)}
            <button onClick={()=> {addStockFunc(tickerName, price)}} className="addStockButton" type="submit">Add Stock</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default AddStock;