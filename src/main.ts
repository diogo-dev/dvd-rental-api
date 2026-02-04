import "dotenv/config";
import express, { Request, Response } from "express";
import { CustomerRouter } from "@/routes/CustomerRouter";
import { StaffRouter } from "@/routes/StaffRouter";
import { RentalRouter } from "@/routes/RentalRouter";
import { PaymentRouter } from "@/routes/PaymentRouter";
import { errorHandler } from "@/middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

// Register routes
app.use("/api/customers", CustomerRouter);
app.use("/api/staff", StaffRouter);
app.use("/api/rentals", RentalRouter);
app.use("/api/payments", PaymentRouter);

// Global error handler (must be registered AFTER all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});