// use axios to make http requests
// import axios from "axios";
import axios from "axios";

const backendApi = import.meta.env.VITE_BACKEND_API as string;

export interface BudgetBreakdownJson {
  moneyIn: Transaction[];
  singlePayments: Transaction[];
  multiPayments: MultiPaymentBreakdown[];
  lastMonthMoneyRemaining: number | null;
  showTour?: boolean;
}

export interface Transaction {
  title: string;
  amount: number;
}

export interface TablePosition {
  x: number | null;
  y: number | null;
}

// MultiPaymentBreakdown
export interface MultiPaymentBreakdown {
  title: string;
  purchases: Transaction[];
  height: number | null;
  color: string;
  columns: { [key: number]: TablePosition };
}

export const upsertBudget = async (
  year: number,
  month: number,
  budgetState: BudgetBreakdownJson,
  accessToken: string,
): Promise<void> => {
  const response = await axios.post(
    `${backendApi}/budget-breakdown/${year}/${month}`,
    budgetState,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (response.status !== 200) throw new Error("Error saving budget");
};

export const getYearMonthData = async (
  year: number,
  month: number,
  accessToken: string,
): Promise<BudgetBreakdownJson> => {
  const response = await axios.get<BudgetBreakdownJson>(
    `${backendApi}/budget-breakdown/${year}/${month}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (response.status !== 200) throw new Error("Error getting budget");
  return response.data;
};
