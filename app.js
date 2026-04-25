const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

const contactsRouter = require("./app/routes/contact.route");
app.use("/api/contacts", contactsRouter);
const sachRouter = require("./app/routes/sach.route");
app.use("/api/sach", sachRouter);
const nxbRouter = require("./app/routes/nhaxuatban.route");
app.use("/api/nhaxuatban", nxbRouter);
const docgiaRouter = require("./app/routes/docgia.route");
app.use("/api/docgia", docgiaRouter);
const nhanvienRouter = require("./app/routes/nhanvien.route");
app.use("/api/nhanvien", nhanvienRouter);
const authRouter = require("./app/routes/auth.route");
app.use("/api/auth", authRouter);
const theodoimuonRouter = require("./app/routes/theodoimuon.route");
app.use("/api/theodoimuon", theodoimuonRouter);
const ApiError = require("./app/api-error");


app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});


app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;