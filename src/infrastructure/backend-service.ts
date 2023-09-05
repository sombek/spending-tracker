// use axios to make http requests
// import axios from "axios";

export const getYearMonthData = async (year: number, month: number) => {
  console.log("getYearMonthData", year, month);
  // wait 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    "money-in": [
      {
        title: "Salary",
        amount: 1000,
      },
      {
        title: "Bonus",
        amount: 200,
      },
    ],
    "money-out": [
      {
        title: "Rent",
        amount: 500,
      },
      {
        title: "Food",
        amount: 200,
      },
    ],
    "money-out-by-category": [
      {
        title: "Food",
        purchases: [
          {
            title: "Pizza",
            amount: 100,
          },
          {
            title: "Burger",
            amount: 50,
          },
        ],
      },
      {
        title: "Bills",
        purchases: [
          {
            title: "Electricity",
            amount: 100,
          },
          {
            title: "Water",
            amount: 50,
          },
        ],
      },
    ],
  };
};
