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
<html>
<body>

<h2>Viasocket Bitrix App</h2>

<p>Domain: ${data.DOMAIN}</p>

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