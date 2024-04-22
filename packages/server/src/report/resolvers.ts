import {report} from '../data.js';

const ok = {ok: true};

const getEntry = (id: string) => report.entries.find(e => e.id === id);

const resolvers = {
  Query: {
    report: () => report,
    entry: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);
      const exceptions = report.exceptions.filter(e => e.entryId === entryId);
      return {...entry, exceptions};
    },
  },
  Report: {
    cashAdvances: async () => {
      // Simulate a slow network request.
      await new Promise(resolve => setTimeout(resolve, 1e3));
      return report.cashAdvances;
    }
  },
  Mutation: {
    updateEntryAmount: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);

      entry.amount += 1;
      report.totalAmount += 1;

      // "Use up" the cash advances.
      if (report.cashAdvances[0]) {
        report.cashAdvances[0].amount -= 1;
        if (!report.cashAdvances[0].amount) {
          report.cashAdvances = [];
        }
      }

      return ok;
    },
    updateEntryReceipt: (_root: void, {entryId}) => {
      const entry = getEntry(entryId);

      if (entry.receipt) {
        entry.receipt = null;
        report.exceptions.push({entryId, text: 'Missing receipt!'});
      } else {
        entry.receipt = 'https://example.com/receipt.jpg';
        const exception = report.exceptions.findIndex(e => e.entryId === entryId);
        report.exceptions.splice(exception, 1);
      }
      return ok;
    },
  }
};

export default resolvers;
