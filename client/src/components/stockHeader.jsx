function StockHeader(props) {
    const { ticker, price } = props;
    return (
        <div className='stockHeaderBox'>
            <h1> {ticker} </h1>
            <h3> ${price} </h3>
        </div>
    );
}
export default StockHeader;