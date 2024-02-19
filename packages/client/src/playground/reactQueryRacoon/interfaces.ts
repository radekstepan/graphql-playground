// The status of the data fragment.
export const enum DataStatus {
  LATEST = 1, // data is up to date
  REQUESTED = 2, // data is being fetched
  STALE = 3, // data is stale
}
