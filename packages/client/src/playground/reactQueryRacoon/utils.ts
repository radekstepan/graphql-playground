export const listById = <T, K extends keyof T>(list: T[], idProp: K) => {
  const byId: Record<string, T[]> = {};
  return list.reduce((acc, obj) => {
    const key = String(obj[idProp]);
    if (acc[key] === undefined) {
      acc[key] = [obj];
    } else {
      acc[key].push(obj);
    }
    return acc;
  }, byId);
};
