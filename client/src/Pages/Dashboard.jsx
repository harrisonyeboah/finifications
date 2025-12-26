// Importing my dependencies
import {useEffect, useState, useRef} from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

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
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [currentTicker, setCurrentTicker] = useState(myUser.myWatchlist?.[0]?.stockTicker || "aapl");
    const [currentTickerPrice, setCurrentTickerPrice] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [wayBackDate, setwayBackDate] = useState(7);
    const [token, setToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const PRODBACKEND = "https://finifications.onrender.com";
    const LOCALBACKEND = "http://localhost:8080";
    const LOCALWEBSOCKET = "ws://localhost:8080/ws";
    const PRODWEBSOCKET = "wss://finifications.onrender.com/ws";

    const CURRENTBACKEND = PRODBACKEND;


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${CURRENTBACKEND}/api/authenticate`, {
                    method: "GET",
                    credentials: "include"
                });
                if (response.status !== 200) {
                    setIsAuthenticated(false);
                    navigate('/login');
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
                navigate('/login');
                
            } finally {
                setAuthChecked(true);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        //if (isAuthenticated === false) return;
        /* This will connect to to my websocket in the backedn */
        // Local host 8080 or production
        socketRef.current = new WebSocket(
        `${LOCALWEBSOCKET}?symbol=${currentTicker}`
        );
        // This will get my websocket messsage. 
        socketRef.current.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        
        // This will get the response type and run accordingly.
        if (payload.type === "CONNECTED") {
            console.log("WebSocket connected");
        };

        if (payload.type === "subscribe") {
            console.log("Subscribed to finhub for:", payload.symbol);
        }

        if (payload.type === "PRICE_UPDATE") {
            const trade = payload.data[0];
            console.log("Price update received:", trade.price);
            setCurrentTickerPrice(trade.price); 
        }

        // We would want to handle errors and then maybe redirect the user to regurlar http requests.
        socketRef.current.onerror = (err) => {
        console.error("Frontend WS error:", err);
        };

        return () => {
        socketRef.current?.close();
        };
    }}, [currentTicker]);



    useEffect(() => {
        const getData = async ()=> {
            //if (isAuthenticated === false) return;
            try {
                const response = await fetch(`${CURRENTBACKEND}/api/getUserInfo`, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                if (response.status === 200) {
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
        //if (isAuthenticated === false) return;
        async function fetchPrice() {
            const price = await priceState();
            setCurrentTickerPrice(price);
        }
        fetchPrice();
    }, [wayBackDate]);
    

    useEffect(() => {
        //if (isAuthenticated === false) return;
        document.title = "Dashboard - Finifications";
        setMessage("Welcome to Finifications Developed by Harrison Yeboah Student at Denison University. ")
    }, []);

    useEffect(() => {
        //if (isAuthenticated === false) return;
        const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return console.log("Permission denied");

            const currentToken = await getToken(messaging, {
            vapidKey: "<YOUR_WEB_PUSH_CERTIFICATE_KEY_PAIR>",
            });

            console.log("FCM Token:", currentToken);
            setToken(currentToken);
        } catch (error) {
            console.error("Error getting FCM token:", error);
        }
        };

        requestPermission();

        // Listen for messages when app is in foreground
        onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        new Notification(payload.notification.title, {
            body: payload.notification.body,
        });
        });
    }, []);

    const deleteButton = async (stockId) => {
        //if (isAuthenticated === false) return;
        const response = await fetch(`${CURRENTBACKEND}/api/deleteButton`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockId})
        }); 

        if (response.status === 200) {
            //if (isAuthenticated === false) return;
            const data = await response.json();
            setMyUser(prev => ({
                ...prev,
                myWatchlist: data.watchlist
            }));
        }
    };

    const handleKeyDown = (e) => {
        //if (isAuthenticated === false) return;
        if (e.key === 'Enter') {
            getTicker(inputValue);
            setInputValue('');
        }
    };

    const handleInputChange = (e) => {
        //if (isAuthenticated === false) return;
        setInputValue(e.target.value);
    };

    const getTicker = async (tickerName) => {
        //if (isAuthenticated === false) return;
        const response = await fetch(
            `${CURRENTBACKEND}/api/getTicker/${tickerName}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ wayBackDate })
            }
        );
        if (response.status !== 200) {
            console.log("Error fetching ticker data");
        }


        const data = await response.json();
        if (response.status === 200) {
            const graphArray = data.myPricesToGraph;
            const currentPrice = data.data.c;

            setCurrentTicker(tickerName);
            setCurrentTickerPrice(currentPrice);
            setChartData(graphArray);

            return data.data.c;
        } else if (response.status === 404) {
            setMessage(data.message);
            if (data.message == "No historical data available.") {
                setChartData([]); // Last line of defense.
            }
        }
        return 0;
    };

    const priceState = () => {
        //Authenticated === false) return;
        const price = getTicker(currentTicker);
        return price;
    };

    

    const addStockToWishlist = async (stockToAdd, notifyPrice, condition) => {
        //if (isAuthenticated === false) return;
        if ((condition === "ABOVE" && notifyPrice > currentTickerPrice) || 
            (condition === "BELOW" && notifyPrice < currentTickerPrice)) {

            const response = await fetch(`${CURRENTBACKEND}/api/addStockToWishlist`, {
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

    const changeTimeLine = async (changeTo) => {
        //if (isAuthenticated === false) return;
        setwayBackDate(changeTo);
    }

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
                            <StockHeader ticker={currentTicker} price={currentTickerPrice} changeTimeLine={changeTimeLine} />
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


