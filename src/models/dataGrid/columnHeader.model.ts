import { FilterOperators } from "../filters/filterOperators.enum";
import { SortDetails } from "../filters/sortDetails.model";

export interface ColumnHeader {
  name: string;
  propertyName: string;
  operators: FilterOperators[];
  activeFilters: { operator: FilterOperators; value: string }[];
  sort: SortDetails;
}
