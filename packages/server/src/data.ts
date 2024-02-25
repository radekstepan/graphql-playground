export type Number = {
  id: string
  value: number
}

export const numbers = new Map<string, Number>();

interface Racoon {
  id: string
  name: string
  totalAmount: number
  exceptions: {
    entryId: string
    text: string
  }[]
  entries: {
    id: string
    amount: number
    receipt: string | null
  }[]
  reset: () => void
}

export const racoon: Racoon = {
  id: 'REP_1',
  name: "Monthly Expenses",
  totalAmount: 2,
  exceptions: [{
    entryId: "EXP_1",
    text: "Missing receipt!"
  }, {
    entryId: "EXP_2",
    text: "Missing receipt!"
  }],
  entries: [{
    id: "EXP_1",
    amount: 1,
    receipt: null
  }, {
    id: "EXP_2",
    amount: 1,
    receipt: null
  }],
  reset() {
    this.totalAmount = 2;
    this.exceptions = [{
      entryId: "EXP_1",
      text: "Missing receipt!"
    }, {
      entryId: "EXP_2",
      text: "Missing receipt!"
    }];
    this.entries[0].amount = 1;
    this.entries[0].receipt = null;
    this.entries[1].amount = 1;
    this.entries[1].receipt = null;
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