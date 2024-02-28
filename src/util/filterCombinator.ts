import { ColumnHeader } from "../models/dataGrid/columnHeader.model";

export function sortCombinator(columns: ColumnHeader[]) {
  return columns.reduce((prev, curr) => {
    if (curr.sort.sorted) {
      return (
        prev +
        `${prev ? "&" : ""}sort=${curr.sort.direction}:${curr.propertyName}`
      );
    }
    return prev + "";
  }, "");
}
