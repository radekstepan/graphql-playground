import {data} from './data.js';

const ok = {ok: true};

const getEntry = (id: string) => data.entries.find(e => e.id === id);

const resolvers = {
  Query: {
    report: () => data,
    entry: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);
      const exceptions = data.exceptions.filter(e => e.entryId === entryId);
      return {...entry, exceptions};
    },
  },
  Report: {
    cashAdvances: async () => {
      // Simulate a slow network request.
      await new Promise(resolve => setTimeout(resolve, 1e3));
      return data.cashAdvances;
    }
  },
  Mutation: {
    reset: () => {
      data.reset();
      return ok;
    },
    updateEntryAmount: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);

      entry.amount += 1;
      data.totalAmount += 1;

      // "Use up" the cash advances.
      if (data.cashAdvances[0]) {
        data.cashAdvances[0].amount -= 1;
        if (!data.cashAdvances[0].amount) {
          data.cashAdvances = [];
        }
      }

      return ok;
    },
    updateEntryReceipt: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);

      if (entry.receipt) {
        entry.receipt = null;
        data.exceptions.push({entryId, text: 'Missing receipt!'});
      } else {
        entry.receipt = 'https://example.com/receipt.jpg';
        const exception = data.exceptions.findIndex(e => e.entryId === entryId);
        data.exceptions.splice(exception, 1);
      }

      return ok;
    },
  }
};

export default resolvers;
