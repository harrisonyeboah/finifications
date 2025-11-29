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
    const [inputValue, setInputValue] = useState("");
    const [currentTicker, setCurrentTicker] = useState(myUser.myWatchlist?.[0]?.stockTicker || "msft");
    const [currentTickerPrice, setCurrentTickerPrice] = useState(0);

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
    /* 
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080'); 

        ws.onopen = () => {
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            setMessage(event.data); // Update state with received message
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
      }, []); 
    */
    
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
        async function fetchPrice() {
            const price = await priceState();
            setCurrentTickerPrice(price);
        }
    fetchPrice();
  }, []);
    

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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        // When I press enter on the key I will reset my state 
        // THen I will call search ticker to call to my backend. 
        getTicker(inputValue);
        // This will then be reseted. 
        setInputValue('');
    }
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        console.log(inputValue);
    };
    const getTicker = async (tickerName) => {
        const response = await fetch(
            `http://localhost:8080/api/getTicker/${tickerName}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();
        if (response.status === 200) {
            setCurrentTicker(tickerName);
            setCurrentTickerPrice(data.c);
            return data.c;
        }
        return 0;
    };

    const priceState = () => {
        const price = getTicker(currentTicker);
        return price;
    }

    const addStockToWishlist = async (stockToAdd, notifyPrice) => {
        const response = await fetch(`http://localhost:8080/api/addStockToWishlist`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stockToAdd,
                notifyPrice
            })
        });

        if (response.status === 200) {
            const data = await response.json();
            // This is my new watchlist.
            console.log("ZE DATA IS", data);
            setMyUser(prev => ({
                ...prev,
                myWatchlist: data.watchlist
            }));
            console.log(myUser);
        }
    };





    




    return (
        <div>
            <div className='dashboardMainContainer'>
                <Navbar></Navbar>
                <h2 className='welcomeUser'> Welcome {myUser.userName} </h2>
                <div className='textBoxHolder'>
                    <input onKeyDown={handleKeyDown} onChange={handleInputChange} type="text" placeholder="Search Ticker" className='stockTickerSearchInput'/>
                </div>
                <div className='allHalvesDiv'>
                    <div className='firstHalfDiv'>
                        <div className="stockHeaderContainer">
                            <StockHeader ticker={currentTicker} price={currentTickerPrice}></StockHeader>
                        </div>
                        <div className='stockVisualizationContainer'>
                            <StockVisualization ticker="MSFT" last="2h ago"></StockVisualization>
                        </div>
                        <div className='addStockContainer'>
                            <AddStock addStockFunc={addStockToWishlist} tickerName={currentTicker} ></AddStock>
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