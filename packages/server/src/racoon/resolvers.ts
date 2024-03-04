import {racoon} from '../data.js';

const ok = {ok: true};

const getEntry = (id: string) => racoon.entries.find(e => e.id === id);

const resolvers = {
  Query: {
    racoon: () => ({})
  },
  Mutation: {
    racoonMutation: () => ({})
  },
  Racoon: {
    report: () => racoon,
    entry: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);
      const exceptions = racoon.exceptions.filter(e => e.entryId === entryId);
      return {...entry, exceptions};
    },
  },
  RacoonReport: {
    cashAdvances: async () => {
      // Simulate a slow network request.
      await new Promise(resolve => setTimeout(resolve, 1e3));
      return racoon.cashAdvances;
    }
  },
  RacoonMutation: {
    updateEntryAmount: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);

      entry.amount += 1;
      racoon.totalAmount += 1;

      // "Use up" the cash advances.
      if (racoon.cashAdvances[0]) {
        racoon.cashAdvances[0].amount -= 1;
        if (!racoon.cashAdvances[0].amount) {
          racoon.cashAdvances = [];
        }
      }

      return ok;
    },
    updateEntryReceipt: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);

      if (entry.receipt) {
        entry.receipt = null;
        racoon.exceptions.push({entryId, text: 'Missing receipt!'});
      } else {
        entry.receipt = 'https://example.com/receipt.jpg';
        const exception = racoon.exceptions.findIndex(e => e.entryId === entryId);
        racoon.exceptions.splice(exception, 1);
      }
      return ok;
    },
  }
};

export default resolvers;
