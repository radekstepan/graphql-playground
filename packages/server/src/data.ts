export type Number = {
  id: string
  value: number
}

export const numbers = new Map<string, Number>();

interface Racoon {
  id: string
  name: string
  totalAmount: number
  exceptions: string[]
  expenses: {
    id: string
    amount: number
    receipt: string | null
  }[]
  reset: () => void
}

export const racoon: Racoon = {
  id: 'REP_1',
  name: "Monthly Expenses",
  totalAmount: 0,
  exceptions: ['Missing receipt!'],
  expenses: [{
    id: "EXP_1",
    amount: 0,
    receipt: null
  }],
  reset() {
    this.totalAmount = 0;
    this.exceptions = ['Missing receipt!'];
    this.expenses[0].amount = 0;
    this.expenses[0].receipt = null;
  }
};

export const resolvers = {
  Mutation: {
    reset: () => {
      numbers.clear();

      racoon.reset();

      return true;
    }
  }
}