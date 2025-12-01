// Importing my dependencies
import {useEffect, useState} from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

// Importing my styles
import "../Styles/Dashboard.css";

// Importing my components
import Navbar from '../components/navbar.jsx';
import StockHeader from '../components/stockHeader.jsx';
import StockVisualization from '../components/stockVisualization.jsx';
import StockWatchlist from '../components/stockWatchlist.jsx';
import AddStock from '../components/addStockComponent.jsx';

export default function Dashboard() {
    
    const navigate = useNavigate();

    const [myUser, setMyUser] = useState({
        userName:"", 
        myWatchlist: []
    });

    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [currentTicker, setCurrentTicker] = useState(myUser.myWatchlist?.[0]?.stockTicker || "aapl");
    const [currentTickerPrice, setCurrentTickerPrice] = useState(0);
    const [chartData, setChartData] = useState([]);

    const BACKEND = "https://finifications.onrender.com";

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${BACKEND}/api/authenticate`, {
                    method: "GET",
                    credentials: "include"
                });
                if (response.status !== 200) {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                navigate('/login');
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const getData = async ()=> {
            try {
                const response = await fetch(`${BACKEND}/api/getUserInfo`, {
                    method: "GET",
                    credentials: "include"
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setMyUser(prev => ({
                        ...prev,
                        userName: data.userName.userName,
                        myWatchlist: data.stockWatchlist
                    }));
                }
            } catch {
                console.log("Error");
            }
        };
        getData();
    },[]);
    
    useEffect(() => {
        async function fetchPrice() {
            const price = await priceState();
            setCurrentTickerPrice(price);
        }
        fetchPrice();
    }, []);
    

    useEffect(() => {
        document.title = "Dashboard - Finifications";
        setMessage("Welcome to Finifications Developed by Harrison Yeboah Student at Denison University. ")
    }, []);

    const deleteButton = async (stockId) => {
        const response = await fetch(`${BACKEND}/api/deleteButton`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockId})
        }); 

        if (response.status === 200) {
            const data = await response.json();
            setMyUser(prev => ({
                ...prev,
                myWatchlist: data.watchlist
            }));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            getTicker(inputValue);
            setInputValue('');
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const getTicker = async (tickerName) => {
        const response = await fetch(
            `${BACKEND}/api/getTicker/${tickerName}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();
        if (response.status === 200) {
            const graphArray = data.myPricesToGraph;
            const currentPrice = data.data.c;

            setCurrentTicker(tickerName);
            setCurrentTickerPrice(currentPrice);
            setChartData(graphArray);

            return data.data.c;
        }
        return 0;
    };

    const priceState = () => {
        const price = getTicker(currentTicker);
        return price;
    };

    const addStockToWishlist = async (stockToAdd, notifyPrice, condition) => {
        if ((condition === "ABOVE" && notifyPrice > currentTickerPrice) || 
            (condition === "BELOW" && notifyPrice < currentTickerPrice)) {

            const response = await fetch(`${BACKEND}/api/addStockToWishlist`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stockToAdd,
                    notifyPrice,
                    condition
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                setMyUser(prev => ({
                    ...prev,
                    myWatchlist: data.watchlist
                }));
            }
        }

        setMessage("Can not add to wishlist.");
    };

    return (
        <div>
            <div className='dashboardMainContainer'>
                <Navbar />
                <h2 className='welcomeUser'> Welcome {myUser.userName} </h2>

                <div className='textBoxHolder'>
                    <input 
                        onKeyDown={handleKeyDown} 
                        onChange={handleInputChange} 
                        type="text" 
                        placeholder="Search Ticker" 
                        className='stockTickerSearchInput'
                    />
                </div>

                <div className='allHalvesDiv'>
                    <div className='firstHalfDiv'>
                        <div className="stockHeaderContainer">
                            <StockHeader ticker={currentTicker} price={currentTickerPrice} />
                        </div>

                        <div className='stockVisualizationContainer'>
                            <StockVisualization prices={chartData} />
                        </div>

                        <div className='addStockContainer'>
                            <AddStock addStockFunc={addStockToWishlist} tickerName={currentTicker} />
                        </div>
                    </div>

                    <div className='secondHalfDiv'>
                        <div className='stockWatchlistContainer'>
                            <StockWatchlist 
                                listOfItems={myUser?.myWatchlist || []} 
                                onDelete={deleteButton} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
