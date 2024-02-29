import { FilterOperators } from "../filters/filterOperators.enum";
import { SortDetails } from "../filters/sortDetails.model";

export type ColumnHeader = {
  name: string;
  propertyName: string;
  operators: FilterOperators[];
  activeFilters: { operator: FilterOperators; value: string }[];
  sort: SortDetails;
} & (
  | { inputType: "text" }
  | { inputType: "select"; selectOptions: { label: string; value: string }[] }
  | { inputType: "datetime" }
);
