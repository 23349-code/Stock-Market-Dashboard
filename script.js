// =======================================
// DOM Elements
// =======================================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const price = document.getElementById("price");
const change = document.getElementById("change");
const openPrice = document.getElementById("open");
const closePrice = document.getElementById("close");

const companyName = document.getElementById("companyName");
const companyInfo = document.getElementById("companyInfo");
const watchBtn = document.getElementById("watchBtn");

// Chart

let chart;

// Default Stock
function showLoading(){

price.innerHTML="Loading...";

change.innerHTML="...";

openPrice.innerHTML="...";

closePrice.innerHTML="...";

}

fetchStock("AAPL");
showLoading();

// Search Button

searchBtn.addEventListener("click", () => {

    const symbol = searchInput.value.trim().toUpperCase();

    if(symbol===""){

        alert("Enter Stock Symbol");

        return;

    }

    fetchStock(symbol);

});
async function fetchStock(symbol){

    try{

        const response = await fetch(

`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`

        );

        const data = await response.json();

        const quote = data["Global Quote"];

        if(!quote){

            alert("Stock Not Found");

            return;

        }

        price.innerHTML="$"+quote["05. price"];

        change.innerHTML=quote["10. change percent"];

        openPrice.innerHTML="$"+quote["02. open"];

        closePrice.innerHTML="$"+quote["08. previous close"];

        companyName.innerHTML=symbol;
        watchBtn.onclick = () => {

    addToWatchlist(symbol);

};

        companyInfo.innerHTML=

"Live market data loaded successfully.";

        loadChart(symbol);

    }

    catch(error){

        console.log(error);

    }

}
async function loadChart(symbol){

    const response = await fetch(

`${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`

    );

    const data = await response.json();

    const series = data["Time Series (Daily)"];

    if(!series) return;

    const labels = Object.keys(series).slice(0,15).reverse();

    const prices = labels.map(date=>series[date]["4. close"]);

    const ctx=document.getElementById("stockChart");

    if(chart){

        chart.destroy();

    }

    chart=new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:symbol,

                data:prices,

                borderColor:"#22c55e",

                backgroundColor:"rgba(34,197,94,.2)",

                fill:true,

                tension:.4

            }]

        }

    });

}
// Keyboard Search
searchInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

searchBtn.click();

}

});
// =======================================
// WATCHLIST
// =======================================

let watchlist =
JSON.parse(localStorage.getItem("watchlist")) || [];

const watchlistElement =
document.getElementById("watchlist");

// Add Current Stock

function addToWatchlist(symbol){

    if(watchlist.includes(symbol)){

        alert("Already in Watchlist");

        return;

    }

    watchlist.push(symbol);

    localStorage.setItem(

        "watchlist",

        JSON.stringify(watchlist)

    );

    displayWatchlist();

}

// Display Watchlist

function displayWatchlist(){

    watchlistElement.innerHTML="";

    watchlist.forEach(stock=>{

        const li=document.createElement("li");

        li.innerHTML=`

            <span>${stock}</span>

            <div>

                <button class="open-btn"

                onclick="fetchStock('${stock}')">

                Open

                </button>

                <button class="delete-btn"

                onclick="removeStock('${stock}')">

                Delete

                </button>

            </div>

        `;

        watchlistElement.appendChild(li);

    });

}

// Remove Stock

function removeStock(symbol){

    watchlist = watchlist.filter(

        stock => stock !== symbol

    );

    localStorage.setItem(

        "watchlist",

        JSON.stringify(watchlist)

    );

    displayWatchlist();

}

displayWatchlist();

setInterval(()=>{

    if(companyName.innerHTML!=="Search Any Stock"){

        fetchStock(companyName.innerHTML);

    }

},60000);
