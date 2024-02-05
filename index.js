import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "../dir.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config({ path: path.resolve(dirname, ".env.local") });

const accessToken = process.env.MP_ACCESS_TOKEN;

const client = new MercadoPagoConfig({
  accessToken: accessToken,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server");
});

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://github.com/gabrieloporto",
        failure: "https://github.com/gabrieloporto",
        pending: "https://github.com/gabrieloporto",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia :(",
    });
  }
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
