import React, { useState } from 'react';
function AddStock() {
    const [message, setMessage] = useState("This will display my message");
    return (
        <div className="addStockBox">
            <input className='inputPrice' placeholder="Notify Price" type='number'></input>
            <button className="addStockButton" type="submit">Add Stock</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default AddStock;