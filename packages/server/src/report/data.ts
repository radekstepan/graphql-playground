interface Report {
  id: string
  name: string
  totalAmount: number
  cashAdvances: {
    id: string
    amount: number
  }[]
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

export const data: Report = {
  id: 'REP_1',
  name: "Monthly Expenses",
  totalAmount: 2,
  cashAdvances: [{
    id: "CA_1",
    amount: 3
  }],
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
    this.cashAdvances = [{
      id: "CA_1",
      amount: 3
    }];
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
