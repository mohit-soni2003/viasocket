const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.post("/bitrix/install", async (req, res) => {
  try {
    console.log("REQ QUERY:", req.query);
    console.log("REQ BODY:", req.body);

    const installData = {
      domain: req.query.DOMAIN || "",
      protocol: req.query.PROTOCOL || "",
      lang: req.query.LANG || "",
      app_sid: req.query.APP_SID || "",

      application_scope: req.body.APPLICATION_SCOPE || "",
      application_token: req.body.APPLICATION_TOKEN || "",
      auth_expires: req.body.AUTH_EXPIRES || "",
      access_token: req.body.AUTH_ID || "",
      refresh_token: req.body.REFRESH_ID || "",
      endpoint: req.body.SERVER_ENDPOINT || "",
      member_id: req.body.member_id || "",
      status: req.body.status || "",
      placement: req.body.PLACEMENT || "",
      placement_options: req.body.PLACEMENT_OPTIONS || ""
    };

    console.log("INSTALL DATA:", installData);

    const webhookResponse = await axios.post(
      "https://flow.sokt.io/func/scriux8a7MNP",
      installData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Webhook response status:", webhookResponse.status);
    console.log("Webhook response data:", webhookResponse.data);

    res.status(200).json({
      success: true,
      message: "Installation data sent to webhook",
      data: installData
    });
  } catch (err) {
    console.error("Install failed");
    console.error("message:", err.message);
    console.error("status:", err?.response?.status);
    console.error("response:", err?.response?.data);

    res.status(500).json({
      success: false,
      error: err.message,
      status: err?.response?.status,
      response: err?.response?.data
    });
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
    <title>viaSocket App Installed</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #333;
        }

        .container {
            background: white;
            padding: 50px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            text-align: center;
            max-width: 480px;
            /* Updated border-top to match the button color */
            border-top: 6px solid rgb(138 26 11);
        }

        .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
            display: block;
        }

        h1 {
            color: #1a1a1a;
            font-size: 28px;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }

        .brand-text {
            /* Updated text color to match the brand color */
            color: rgb(138 26 11);
            font-weight: bold;
        }

        p {
            color: #5f6368;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .instruction-box {
            background: #f8f9fa;
            border: 1px dashed #dadce0;
            padding: 20px;
            border-radius: 12px;
            text-align: left;
            margin-bottom: 25px;
        }

        .instruction-box h2 {
            font-size: 14px;
            text-transform: uppercase;
            color: #70757a;
            margin-top: 0;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }

        ul {
            margin: 0;
            padding-left: 20px;
            color: #3c4043;
            font-size: 15px;
        }

        li {
            margin-bottom: 8px;
        }

        .btn-link {
            display: inline-block;
            /* Your requested RGB color */
            background-color: rgb(138 26 11);
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: opacity 0.2s ease;
            margin-top: 10px;
        }

        .btn-link:hover {
            opacity: 0.9;
        }

        .refresh-hint {
            margin-top: 25px;
            font-size: 12px;
            color: #9aa0a6;
        }
    </style>
</head>
<body>

<div class="container">
    <span class="success-icon">✅</span>
    <h1><span class="brand-text">viaSocket</span> Installed</h1>
    <p>The installation is complete! You are now ready to automate your workflows between Bitrix24 and your favorite apps.</p>

    <div class="instruction-box">
        <h2>Next Steps:</h2>
        <ul>
            <li><strong>Refresh</strong> your browser page (F5 or ⌘+R).</li>
            <li>Alternatively, <strong>reopen</strong> the app from the Bitrix24 menu.</li>
        </ul>
    </div>

    <a href="https://viasocket.com/signup?state={%22utm_source%22:%22/%22}&utm_source=/" target="_blank" class="btn-link">Finish Setup on viaSocket →</a>

    <div class="refresh-hint">
        Installation reference: BX24-Viasocket-v1
    </div>
</div>

<script src="https://api.bitrix24.com/api/v1/"></script>
<script>
    BX24.init(function(){
        console.log("viaSocket installation page loaded.");
    });
</script>

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