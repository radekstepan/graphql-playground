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
    entry: (_root: void, {id}) => getEntry(id)
  },
  RacoonMutation: {
    updateEntryAmount: (_root: void, {id}) => {
      const entry = getEntry(id);

      entry.amount += 1;
      racoon.totalAmount += 1;
      return ok;
    },
    updateEntryReceipt: (_root: void, {id}) => {
      const entry = getEntry(id);

      if (entry.receipt) {
        entry.receipt = null;
        racoon.exceptions.push('Missing receipt!');
      } else {
        entry.receipt = 'https://example.com/receipt.jpg';
        racoon.exceptions.pop();
      }
      return ok;
    },
  }
};

export default resolvers;
