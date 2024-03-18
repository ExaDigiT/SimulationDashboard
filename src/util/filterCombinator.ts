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

export function operatorCombinator(columns: ColumnHeader[]) {
  return columns
    .filter((column) => column.activeFilters.length > 0)
    .reduce((prev, curr) => {
      const columnFilters = curr.activeFilters.reduce(
        (previousFilters, currentFilter) =>
          previousFilters +
          `${previousFilters ? "&" : ""}${curr.propertyName}=${currentFilter.operator}:${currentFilter.value}`,
        ""
      );
      return prev + `${prev ? "&" : ""}${columnFilters}`;
    }, "");
}
