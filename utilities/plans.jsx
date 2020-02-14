const all_plans = function(currency_code) {
  return currency_code == "INR"
    ? {
        monthly: {
          price: 500,
          currency_symbol: "₹",
          currency: "INR",
          name: "Monthly"
        },
        yearly: {
          price: 5000,
          currency_symbol: "₹",
          currency: "INR",
          name: "Yearly"
        },
        lifetime: {
          price: 15000,
          currency_symbol: "₹",
          currency: "INR",
          name: "Lifetime"
        }
      }
    : {
        monthly: {
          price: 6,
          currency_symbol: "$",
          currency: "USD",
          name: "Monthly"
        },
        yearly: {
          price: 60,
          currency_symbol: "$",
          currency: "USD",
          name: "Yearly"
        },
        lifetime: {
          price: 200,
          currency_symbol: "$",
          currency: "USD",
          name: "Lifetime"
        }
      };
};

export const get_currency = currency => {
  return currency == "INR" ? "INR" : "USD";
};

const plan_names = ["monthly", "yearly", "lifetime"];

export const current_plan = (plan, currency) => {
  currency = get_currency(currency);

  const query_plans = plan_names.includes(plan.toLowerCase())
    ? plan.toLowerCase()
    : "monthly";

  const plans = all_plans(currency);
  return plans[query_plans];
};

export default all_plans;
