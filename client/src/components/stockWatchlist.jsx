import "../Styles/Dashboard.css";
function StockWatchlistItem(props) {
    const {ticker, price,id, onDelete} = props; // This will based on the api data etc. 
    return (
        <div className="stockWatchlistItem">
            <h3 className="itemHeader"> {ticker} @ ${price} </h3>
            <button key={id} onClick={() => onDelete(id)} className="stockItemDeleteButton"> Delete</button>
        </div>
    );  
}
function StockWatchlist({listOfItems = [], onDelete}) {
    /* This is dummy static data for now */
    return (
        <div className="stockWatchlistBox">
            <h2 className="watchlistHeader"> My Stock Watchlist </h2>
            <div className="stockWatchlistItems">
                    {listOfItems.map((item, index) => (
                            <StockWatchlistItem 
                                ticker={item.stockTicker} 
                                id = {item.id}
                                onDelete = {onDelete}
                            ></StockWatchlistItem>
            
                    ))}
            </div>
        </div>
    );
}
export default StockWatchlist;