// The status of the data fragment.
export const enum DataStatus {
  LATEST = "LATEST", // data is up to date
  REQUESTED = "REQUESTED", // data is being fetched
  STALE = "STALE", // data is stale
}
