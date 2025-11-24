import Navbar from '../components/navbar.jsx';
import "../Styles/Dashboard.css";
import StockHeader from '../components/stockHeader.jsx';
import StockVisualization from '../components/stockVisualization.jsx';
import StockWatchlist from '../components/stockWatchlist.jsx';
import AddStock from '../components/addStockComponent.jsx';
export default function Dashboard() {
const dummyStockList = [
    {
        ticker: "AAPL",
        condition: "Above",
        price: 185.32
    },
    {
        ticker: "TSLA",
        condition: "Below",
        price: 210.45
    },
    {
        ticker: "AMZN",
        condition: "Above",
        price: 142.88
    },
    {
        ticker: "NVDA",
        condition: "Below",
        price: 118.23
    },
    {
        ticker: "META",
        condition: "Above",
        price: 325.10
    },
    {
        ticker: "GOOGL",
        condition: "Below",
        price: 132.55
    },
    {
        ticker: "MSFT",
        condition: "Above",
        price: 415.22
    },
    {
        ticker: "NFLX",
        condition: "Below",
        price: 580.14
    },
    {
        ticker: "AMD",
        condition: "Above",
        price: 165.92
    },
    {
        ticker: "INTC",
        condition: "Below",
        price: 34.78
    },
    {
        ticker: "DIS",
        condition: "Above",
        price: 95.20
    },
    {
        ticker: "UBER",
        condition: "Below",
        price: 68.13
    },
    {
        ticker: "SHOP",
        condition: "Above",
        price: 77.44
    },
    {
        ticker: "COIN",
        condition: "Below",
        price: 123.66
    },
    {
        ticker: "IBM",
        condition: "Above",
        price: 171.05
    }
];



    return (
        <div>
            <div className='dashboardMainContainer'>
                <Navbar></Navbar>
                <h2 className='welcomeUser'> Welcome noto.harry </h2>
                <div className='textBoxHolder'>
                    <input type="text" placeholder="Search Ticker" className='stockTickerSearchInput'/>
                </div>
                <div className='allHalvesDiv'>
                    <div className='firstHalfDiv'>
                        <div className="stockHeaderContainer">
                            <StockHeader ticker="MSFT" price="12.99"></StockHeader>
                        </div>
                        <div className='stockVisualizationContainer'>
                            <StockVisualization ticker="MSFT" last="2h ago"></StockVisualization>
                        </div>
                        <div className='addStockContainer'>
                            <AddStock></AddStock>
                        </div>
                   </div>
                <div className='secondHalfDiv'>
                    <div className='stockWatchlistContainer'>
                        <StockWatchlist listOfItems={dummyStockList} />
                    </div>
                </div>

            </div>
        </div>

        </div>  
            
    );
}