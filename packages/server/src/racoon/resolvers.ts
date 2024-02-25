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
    entry: (_root: void, {id}) => {
      const entry = getEntry(id);
      const exceptions = racoon.exceptions.filter(e => e.entryId === id);
      return {...entry, exceptions};
    }
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
        racoon.exceptions.push({entryId: id, text: 'Missing receipt!'});
      } else {
        entry.receipt = 'https://example.com/receipt.jpg';
        const exception = racoon.exceptions.findIndex(e => e.entryId === id);
        racoon.exceptions.splice(exception, 1);
      }
      return ok;
    },
  }
};

export default resolvers;
