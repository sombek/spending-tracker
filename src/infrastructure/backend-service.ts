// use axios to make http requests
// import axios from "axios";
import axios from "axios";

export interface BudgetBreakdownJson {
  moneyIn: Transaction[];
  singlePayments: Transaction[];
  multiPayments: MultiPaymentBreakdown[];
}

export interface Transaction {
  title: string;
  amount: number;
}

// MultiPaymentBreakdown
export interface MultiPaymentBreakdown {
  title: string;
  purchases: Transaction[];
}

export const upsertBudget = async (
  year: number,
  month: number,
  budgetState: BudgetBreakdownJson,
): Promise<void> => {
  const response = await axios.post(
    `http://localhost:8000/budget-breakdown/${year}/${month}`,
    budgetState,
  );
  if (response.status !== 200) throw new Error("Error saving budget");
};

export const getYearMonthData = async (
  year: number,
  month: number,
): Promise<BudgetBreakdownJson> => {
  const response = await axios.get<BudgetBreakdownJson>(
    `http://localhost:8000/budget-breakdown/${year}/${month}`,
    // convert all responses to camelCase
  );
  if (response.status !== 200) throw new Error("Error getting budget");
  return response.data;
};
