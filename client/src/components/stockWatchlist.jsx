function StockWatchlistItem(props) {
    const {ticker, price, id} = props; // This will based on the api data etc. 
    return (
        <div className="stockWatchlistItem">
            <h3 className="itemHeader"> {ticker} @ ${price} </h3>
            <button className="stockItemDeleteButton"> Delete</button>
        </div>
    );  
}
function StockWatchlist({listOfItems = []}) {
    /* This is dummy static data for now */
    return (
        <div className="stockWatchlistBox">
            <h2 className="watchlistHeader"> My Stock Watchlist </h2>
            <div className="stockWatchlistItems">
                    {listOfItems.map((item, index) => (
                            <StockWatchlistItem 
                                ticker={item.ticker} 
                                price={item.price}
                                id = {index}
                            ></StockWatchlistItem>
            
                    ))}
            </div>
        </div>
    );
}
export default StockWatchlist;