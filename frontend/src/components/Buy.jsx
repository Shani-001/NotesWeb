import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { BACKEND_URL } from "../../utils/utils.js";
function Buy() {
  const { notesId } = useParams();
  console.log(notesId);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [notes, setnotes] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; //using optional chaining to avoid crashing incase token is not there!!!

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchBuyNotesData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/notes/buy/${notesId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Include cookies if needed
          }
        );
        console.log(response.data);
        setnotes(response.data.notesFound);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("you have already purchased this notes");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors);
        }
      }
    };
    fetchBuyNotesData();
  }, [notesId]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Cardelement not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe PaymentMethod Error: ", error);
      setLoading(false);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }
    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      setCardError("your payment id: ", paymentIntent.id);
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        notesId: notesId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment info: ", paymentInfo);
      await axios
        .post(`${BACKEND_URL}/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in making payment");
        });
      // const handleCheckout = async () => {
      // try {
      //   // Load Stripe with your public key
      //   const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      //   // Create a checkout session on your backend
      //   const { data: session } = await axios.post(
      //     "http://localhost:4000/api/v1/notes/webhook",
      //     {
      //       email: user.email,
      //       amount: 499,
      //     }
      //   );

      //   // Redirect user to Stripe Checkout page
      //   await stripe.redirectToCheckout({ sessionId: session.id });
      // } catch (error) {
      //   console.error("Payment error:", error);
      //   alert("Something went wrong during payment!");
      // }
      toast.success("Payment Successful");
      navigate("/purchases");
    }
    setLoading(false);
  };
  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full m-10 md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">₹{notes.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Notes name</h1>
              <p className="text-red-500 font-bold">{notes.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              {/* <div>
                <button type="button" className="border-2 w-full">google pay </button>
              </div> */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { BACKEND_URL } from "../../utils/utils.js";

// function Buy() {
//   const { notesId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [notes, setNotes] = useState({});
//   const [clientSecret, setClientSecret] = useState("");
//   const [error, setError] = useState("");
//   const [cardError, setCardError] = useState("");

//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   if (!token) navigate("/login");

//   // 🟢 Fetch payment intent and note details
//   useEffect(() => {
//     const fetchBuyNotesData = async () => {
//       try {
//         const response = await axios.post(
//           `${BACKEND_URL}/notes/buy/${notesId}`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );

//         setNotes(response.data.notesFound);
//         setClientSecret(response.data.clientSecret);
//       } catch (error) {
//         if (error?.response?.status === 400) {
//           setError("You have already purchased this note.");
//           navigate("/purchases");
//         } else {
//           setError(error?.response?.data?.errors || "Payment setup failed.");
//         }
//       }
//     };

//     fetchBuyNotesData();
//   }, [notesId]);

//   // 🟢 Handle payment submission
//   const handlePurchase = async (event) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     setCardError("");

//     const card = elements.getElement(CardElement);
//     if (!card) {
//       setCardError("Card element not found");
//       setLoading(false);
//       return;
//     }

//     // Create payment method
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card,
//     });

//     if (error) {
//       setCardError(error.message);
//       setLoading(false);
//       return;
//     }

//     // Confirm the payment
//     const { paymentIntent, error: confirmError } =
//       await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card,
//           billing_details: {
//             name: user?.user?.firstName,
//             email: user?.user?.email,
//           },
//         },
//       });

//     if (confirmError) {
//       setCardError(confirmError.message);
//       setLoading(false);
//       return;
//     }

//     if (paymentIntent.status === "succeeded") {
//       const paymentInfo = {
//         email: user?.user?.email,
//         userId: user.user._id,
//         notesId,
//         paymentId: paymentIntent.id,
//         amount: paymentIntent.amount,
//         status: paymentIntent.status,
//       };

//       try {
//         await axios.post(`${BACKEND_URL}/order`, paymentInfo, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });

//         toast.success("Payment Successful 🎉");
//         navigate("/purchases");
//       } catch (err) {
//         console.error(err);
//         toast.error("Error saving payment info");
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <>
//       {error ? (
//         <div className="flex justify-center items-center h-screen">
//           <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
//             <p className="text-lg font-semibold">{error}</p>
//             <Link
//               className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
//               to={"/purchases"}
//             >
//               Go to Purchases
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col sm:flex-row my-40 container mx-auto">
//           <div className="w-full m-10 md:w-1/2">
//             <h1 className="text-xl font-semibold underline">Order Details</h1>
//             <div className="flex items-center text-center space-x-2 mt-4">
//               <h2 className="text-gray-600 text-sm">Total Price</h2>
//               <p className="text-red-500 font-bold">₹{notes.price}</p>
//             </div>
//             <div className="flex items-center text-center space-x-2">
//               <h1 className="text-gray-600 text-sm">Notes name</h1>
//               <p className="text-red-500 font-bold">{notes.title}</p>
//             </div>
//           </div>

//           <div className="w-full md:w-1/2 flex justify-center items-center">
//             <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
//               <h2 className="text-lg font-semibold mb-4">
//                 Process your Payment
//               </h2>

//               <form onSubmit={handlePurchase}>
//                 <CardElement
//                   options={{
//                     style: {
//                       base: {
//                         fontSize: "16px",
//                         color: "#424770",
//                         "::placeholder": { color: "#aab7c4" },
//                       },
//                       invalid: { color: "#9e2146" },
//                     },
//                   }}
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
//                 >
//                   {loading ? "Processing..." : "Pay"}
//                 </button>
//               </form>

//               {cardError && (
//                 <p className="text-red-500 font-semibold text-xs mt-2">
//                   {cardError}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Buy;
