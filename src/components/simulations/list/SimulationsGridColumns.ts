import { FilterOperators } from "../../../models/filterOperators.enum";

export interface SimulationColumn {
  name: string;
  propertyName: string;
  operators: FilterOperators[];
  activeFilters: { operator: FilterOperators; value: string }[];
  sort:
    | { sorted: true; direction: "asc" | "desc" }
    | { sorted: false; direction: null };
}

export const columns: SimulationColumn[] = [
  {
    name: "Id",
    propertyName: "id",
    operators: [
      FilterOperators.contains,
      FilterOperators.not_contains,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.starts_with,
      FilterOperators.ends_with,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
      FilterOperators.min_len,
      FilterOperators.max_len,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
  {
    name: "State",
    propertyName: "state",
    operators: [
      FilterOperators.contains,
      FilterOperators.not_contains,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.starts_with,
      FilterOperators.ends_with,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
      FilterOperators.min_len,
      FilterOperators.max_len,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
  {
    name: "User",
    propertyName: "user",
    operators: [
      FilterOperators.contains,
      FilterOperators.not_contains,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.starts_with,
      FilterOperators.ends_with,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
      FilterOperators.min_len,
      FilterOperators.max_len,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
  {
    name: "Logical Start",
    propertyName: "logical_start",
    operators: [
      FilterOperators.gt,
      FilterOperators.gte,
      FilterOperators.lt,
      FilterOperators.lte,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
  {
    name: "Logical End",
    propertyName: "logical_end",
    operators: [
      FilterOperators.gt,
      FilterOperators.gte,
      FilterOperators.lt,
      FilterOperators.lte,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
  {
    name: "Run Start",
    propertyName: "run_start",
    operators: [
      FilterOperators.gt,
      FilterOperators.gte,
      FilterOperators.lt,
      FilterOperators.lte,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
  {
    name: "Run End",
    propertyName: "run_end",
    operators: [
      FilterOperators.gt,
      FilterOperators.gte,
      FilterOperators.lt,
      FilterOperators.lte,
      FilterOperators.eq,
      FilterOperators.neq,
      FilterOperators.one_of,
      FilterOperators.not_one_of,
    ],
    activeFilters: [],
    sort: { sorted: false, direction: null },
  },
] as const;
