const express = require("express");
const mongoose = require("mongoose");
const BitrixInstall = require("./dbmodel");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -----------------------------
MongoDB
----------------------------- */

mongoose.connect("mongodb+srv://mohitsonip1847_db_user:XxqltokHHh6h58v6@cluster0.osyvqao.mongodb.net/CoinTrack")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));


/* -----------------------------
Home
----------------------------- */

app.get("/",(req,res)=>{
res.send("Bitrix App Running");
});


/* -----------------------------
INSTALLER PAGE
Bitrix opens this page
----------------------------- */

app.get("/bitrix/install",(req,res)=>{

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Installing Viasocket</title>
<script src="https://api.bitrix24.com/api/v1/"></script>
</head>

<body>

<h2>Installing Viasocket App...</h2>

<script>

BX24.init(function(){

console.log("Bitrix initialized");

BX24.callMethod("app.info",{},function(result){

if(result.data().INSTALLED === false){

// Register Deal Tab
BX24.callMethod(
"placement.bind",
{
PLACEMENT:"CRM_DEAL_DETAIL_TAB",
HANDLER:"https://viasocket-1xyz.onrender.com/deal-tab",
TITLE:"Viasocket Data"
},
function(){

console.log("Placement registered");

// Subscribe to event
BX24.callMethod(
"event.bind",
{
event:"ONCRMDEALADD",
handler:"https://viasocket-1xyz.onrender.com/event-handler"
},
function(){

console.log("Event registered");

// Finish installation
BX24.installFinish();

});

});

}

});

});

</script>

</body>
</html>
`);

});


/* -----------------------------
INSTALL API
Bitrix sends OAuth tokens
----------------------------- */

app.post("/bitrix/install",async(req,res)=>{

try{

const {
AUTH_ID,
REFRESH_ID,
AUTH_EXPIRES,
SERVER_ENDPOINT,
member_id,
status,
PLACEMENT
} = req.body;

const DOMAIN = req.query.DOMAIN;

const installData={
domain:DOMAIN,
access_token:AUTH_ID,
refresh_token:REFRESH_ID,
endpoint:SERVER_ENDPOINT,
member_id:member_id,
auth_expires:AUTH_EXPIRES,
placement:PLACEMENT,
status:status
};

await BitrixInstall.findOneAndUpdate(
{member_id:member_id},
installData,
{upsert:true,new:true}
);

console.log("Installation stored");

res.redirect("/bitrix/install");

}catch(err){

console.error(err);
res.status(500).send("Install failed");

}

});


/* -----------------------------
APP MAIN PAGE
----------------------------- */

app.all("/bitrix/app",(req,res)=>{

const data = req.method === "POST" ? req.body : req.query;

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Viasocket App Installed</title>

<style>
body{
font-family: Arial, sans-serif;
background:#f4f6f9;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
margin:0;
}

.container{
background:white;
padding:40px;
border-radius:10px;
box-shadow:0 4px 15px rgba(0,0,0,0.1);
text-align:center;
max-width:500px;
}

h1{
color:#2e7d32;
margin-bottom:10px;
}

p{
color:#555;
font-size:16px;
}

button{
margin-top:20px;
padding:10px 20px;
font-size:16px;
background:#0d6efd;
color:white;
border:none;
border-radius:6px;
cursor:pointer;
}

button:hover{
background:#0b5ed7;
}
</style>

</head>

<body>

<div class="container">

<h1>✅ Viasocket Installed</h1>

<p>Your Viasocket application has been successfully installed.</p>


<p>Please refresh the Bitrix24 page or reopen the application to start using it.</p>

<button onclick="refreshBitrix()">Refresh Page</button>

<script src="https://api.bitrix24.com/api/v1/"></script>

<script>
function refreshBitrix(){

BX24.init(function(){

BX24.callMethod('app.reload');

});

}
</script>
</div>

</body>
</html>
`);

});


/* -----------------------------
DEAL TAB UI
----------------------------- */

app.all("/deal-tab",(req,res)=>{

res.send(`
<html>
<body>

<h3>Viasocket Deal Tab</h3>

<p>Custom Deal Tab Loaded</p>

</body>
</html>
`);

});


/* -----------------------------
EVENT HANDLER
----------------------------- */

app.post("/event-handler",(req,res)=>{

console.log("Bitrix Event Received:",req.body);

res.send("Event received");

});


/* -----------------------------
SERVER
----------------------------- */

app.listen(PORT,()=>{
console.log("Server running on port "+PORT);
});