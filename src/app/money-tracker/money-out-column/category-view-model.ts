// type of the category view model
export interface CategoryViewModel {
  title: string;
  purchases: PurchaseViewModel[];
}

export interface PurchaseViewModel {
  title: string;
  amount: number;
}
