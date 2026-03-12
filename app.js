const express = require("express");
const axios = require("axios");
const BitrixInstall = require("./dbmodel");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://mohitsonip1847_db_user:XxqltokHHh6h58v6@cluster0.osyvqao.mongodb.net/CoinTrack", {
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));





// Home route
app.get("/", (req, res) => {
  res.send("Bitrix App Server Running");
});


// Installer endpoint
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

    res.status(200).send("Bitrix installation stored successfully");

  } catch (err) {

    console.error("Install Error:", err);
    res.status(500).send("Install failed");

  }

});


// // Call Bitrix API
// app.get("/bitrix/user", async (req, res) => {

//   const memberId = req.query.member_id;

//   try {

//     const data = await BitrixInstall.findOne({ member_id: memberId });

//     if (!data) {
//       return res.send("Installation not found");
//     }

//     const response = await axios.get(
//       `https://${data.domain}/rest/user.current`,
//       {
//         params: {
//           auth: data.access_token
//         }
//       }
//     );

//     res.json(response.data);

//   } catch (err) {

//     console.error("Bitrix API Error:", err.response?.data || err.message);

//     res.status(500).send("API call failed");

//   }

// });


// App UI page
// app.get("/bitrix/app", (req, res) => {

//   res.send(`
//     <html>
//       <body>
//         <h2>Bitrix App Loaded</h2>
//         <p>DOMAIN: ${req.query.DOMAIN}</p>
//         <p>AUTH_ID: ${req.query.AUTH_ID}</p>
//       </body>
//     </html>
//   `);

// });


// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});