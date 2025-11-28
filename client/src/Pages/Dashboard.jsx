// Importing my dependencies
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

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
    // I will check to see if the user is authenticated here using useEffect
    // My state is empty.
    const [myUser, setMyUser] = useState({
        userName:"", 
        myWatchlist: []
    })
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        // Authentication check logic can be added here
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/authenticate", {
                    method: "GET",
                    credentials: "include" // Include cookies in the request
                });
                if (response.status !== 200) {
                    // If not authenticated, redirect to login
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                navigate('/login');
            }
        };
        checkAuth();
    }, []);
    // I will connect to my web socket on local host 8080.    
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080'); 

        ws.onopen = () => {
            console.log('WebSocket connection established');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessage(event.data); // Update state with received message
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            ws.close();
        };
      }, []); // Empty dependency array ensures this runs once on mount
    
    // I will fetch my user info 
    useEffect(() => {
        const getData = async ()=> {
            try {
                const response = await fetch("http://localhost:8080/api/getUserInfo", {
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
                    console.log("My username is  ", data.userName.userName);
                    console.log("My stock watchlist is  ", data.stockWatchlist);
                    console.log("My react state current is ", myUser);
                }
            } catch {
                console.log("Error");
            }
        }
        getData();
    },[])

    useEffect(() => {
        document.title = "Dashboard - Finifications";
    }, []);


    const deleteButton = async (stockId) => {
        const response = await fetch("http://localhost:8080/api/deleteButton", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({stockId})
        }); 
        if (response.status === 200) {
            const data = await response.json();
            // This is my new watchlist.
            console.log(data.watchlist);
            setMyUser(prev => ({
                ...prev,
                myWatchlist: data.watchlist
            }));
        }
    }

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
    console.log("My dummy list");
    console.log(dummyStockList);
    console.log("My Dyanamic list.")
    console.log(myUser.myWatchlist);



    return (
        <div>
            <div className='dashboardMainContainer'>
                <Navbar></Navbar>
                <h2 className='welcomeUser'> Welcome {myUser.userName} </h2>
                <div className='textBoxHolder'>
                    <input type="text" placeholder="Search Ticker" className='stockTickerSearchInput'/>
                </div>
                <div className='allHalvesDiv'>
                    <div className='firstHalfDiv'>
                        <div className="stockHeaderContainer">
                            <StockHeader ticker={myUser.myWatchlist?.[0]?.stockTicker || "No stocks yet"} price="12.99"></StockHeader>
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
                        <StockWatchlist listOfItems={myUser?.myWatchlist || []} onDelete={deleteButton} />
                    </div>
                </div>

            </div>
        </div>

        </div>  
            
    );
}