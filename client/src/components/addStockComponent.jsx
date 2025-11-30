import React, { useState } from 'react';

function AddStock({ addStockFunc, tickerName }) {
    const [price, setPrice] = useState(""); // Notify price
    const [selected, setSelected] = useState(null);

    const optionLabels = {
        option1: "ABOVE",
        option2: "BELOW"
    };

    const handleChange = (option) => {
        setSelected(option);
    };

    const message = selected ? `You selected: ${optionLabels[selected]}` : "This will display my message";

    return (
        <div className="addStockBox">
            <input
                className='inputPrice'
                placeholder="Notify Price"
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <button
                onClick={() => addStockFunc(tickerName, price, optionLabels[selected])}
                className="addStockButton"
                type="submit"
            >
                Add Stock
            </button>

            <div className="radioContainer">
                {Object.entries(optionLabels).map(([key, label]) => (
                    <label key={key} className="aboveOrBelowRadio">
                        <input
                            type="radio"
                            name="options"
                            value={key}
                            checked={selected === key}
                            onChange={() => handleChange(key)}
                        />
                        {label}
                    </label>
                ))}
            </div>

            <p className="message">{message}</p>
        </div>
    );
}

export default AddStock;
