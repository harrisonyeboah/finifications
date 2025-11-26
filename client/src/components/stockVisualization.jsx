import "../Styles/Dashboard.css";
function StockVisualization(props) {
    const {ticker, last} = props;
    // There will probably be more based on the api that we are fetching from.
    // This will hold the visualization of the stock data. 
    return (
        <div className="stockVisualizationBox">

        </div>
    );
}

export default StockVisualization;