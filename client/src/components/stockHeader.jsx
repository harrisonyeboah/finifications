import "../Styles/Dashboard.css";
function StockHeader(props) {
    const { ticker, price, changeTimeLine } = props;
    return (
        // This is it 
        <div className='stockHeaderBox'>
            <h1> {ticker} </h1>
            <h3> ${price} </h3>
            <div className='buttonDiv'>
                <button onClick={() => changeTimeLine(7)} className="dateButton"> 7d </button>
                <button onClick={() => changeTimeLine(14)} className="dateButton"> 14d </button>
                <button onClick={() => changeTimeLine(21)} className="dateButton"> 28d </button>
            </div>
        </div>
    );
}
export default StockHeader;