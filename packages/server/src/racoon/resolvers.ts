import {racoon} from '../data.js';

const ok = {ok: true};

const resolvers = {
  Query: {
    racoon: () => ({})
  },
  Mutation: {
    racoonMutation: () => ({})
  },
  Racoon: {
    report: () => racoon,
  },
  RacoonMutation: {
    updateEntry: () => {
      racoon.expenses[0].amount += 1;
      racoon.totalAmount += 1;
      return ok;
    },
    updateReceipt: () => {
      if (racoon.expenses[0].receipt) {
        racoon.expenses[0].receipt = null;
        racoon.exceptions.push('Missing receipt!');
      } else {
        racoon.expenses[0].receipt = 'https://example.com/receipt.jpg';
        racoon.exceptions = [];
      }
      return ok;
    },
  }
};

export default resolvers;
