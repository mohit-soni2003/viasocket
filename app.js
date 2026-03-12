const express = require("express");
const mongoose = require("mongoose");
const BitrixInstall = require("./dbmodel");

const app = express();
const PORT = 3000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -----------------------------
   MongoDB Connection
----------------------------- */

mongoose.connect("mongodb+srv://mohitsonip1847_db_user:XxqltokHHh6h58v6@cluster0.osyvqao.mongodb.net/CoinTrack")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

/* -----------------------------
   Home Route
----------------------------- */

app.get("/", (req, res) => {
  res.send("Bitrix App Server Running");
});


/* -----------------------------
   INSTALLER PAGE (GET)
   Bitrix loads this page
   after admin clicks install
----------------------------- */

app.get("/bitrix/install", (req, res) => {

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Installing App</title>
<script src="https://api.bitrix24.com/api/v1/"></script>
</head>

<body>

<h2>Installing Viasocket App...</h2>

<script>

BX24.init(function(){

console.log("Bitrix initialized");

BX24.callMethod("app.info",{},function(result){

console.log(result.data());

if(result.data().INSTALLED === false){

BX24.callMethod(
"placement.bind",
{
PLACEMENT:"CRM_DEAL_DETAIL_TAB",
HANDLER:"https://viasocket-1xyz.onrender.com/deal-tab",
TITLE:"Viasocket Data"
},
function(){

console.log("Placement registered");

BX24.installFinish();

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
   INSTALL API (POST)
   Bitrix sends tokens here
----------------------------- */

app.post("/bitrix/install", async (req, res) => {

  try {

    console.log("Query:", req.query);
    console.log("Body:", req.body);

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

    const installData = {
      domain: DOMAIN,
      access_token: AUTH_ID,
      refresh_token: REFRESH_ID,
      endpoint: SERVER_ENDPOINT,
      member_id: member_id,
      auth_expires: AUTH_EXPIRES,
      placement: PLACEMENT,
      status: status
    };

    const saved = await BitrixInstall.findOneAndUpdate(
      { member_id: member_id },
      installData,
      { upsert: true, new: true }
    );

    console.log("Saved Install:", saved);

    res.redirect("/bitrix/install");

  } catch (err) {

    console.error("Install Error:", err);
    res.status(500).send("Install failed");

  }

});


/* -----------------------------
   MAIN APP PAGE
----------------------------- */

app.all("/bitrix/app", (req, res) => {

  res.send(`
<html>
<body>

<h2>Viasocket Bitrix App</h2>

<p>Domain: ${req.query.DOMAIN}</p>
<p>Member: ${req.query.member_id}</p>

</body>
</html>
`);

});


/* -----------------------------
   DEAL TAB UI
----------------------------- */

app.get("/deal-tab", (req, res) => {

  res.send(`
<html>
<body>

<h3>Deal Tab Loaded</h3>
<p>This is the custom tab inside deal.</p>

</body>
</html>
`);

});


/* -----------------------------
   START SERVER
----------------------------- */

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});