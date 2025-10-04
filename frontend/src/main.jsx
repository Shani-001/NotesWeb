import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51SCM8rJMQOBE2NHqp4nPKw8SpQaQmYn74V7RlOPUiirJkIGutwjQG2JNUgTpjQXjN2uVeXdaOCpVJiMj6250ZfzE00N1VXpcjZ"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
