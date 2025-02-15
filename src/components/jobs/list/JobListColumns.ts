import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";
import { FilterOperators } from "../../../models/filters/filterOperators.enum";

export const headers: ColumnHeader[] = [
  {
    activeFilters: [],
    inputType: "text",
    name: "Id",
    operators: [
      FilterOperators.Contains,
      FilterOperators.DoesNotContain,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.StartsWith,
      FilterOperators.EndsWith,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
      FilterOperators.MinimumLength,
      FilterOperators.MaxiumumLength,
    ],
    propertyName: "job_id",
    sort: { sortable: true, direction: null },
    size: "small",
  },
  {
    activeFilters: [],
    inputType: "text",
    name: "Name",
    propertyName: "name",
    sort: { sortable: true, direction: null },
    operators: [
      FilterOperators.Contains,
      FilterOperators.DoesNotContain,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.StartsWith,
      FilterOperators.EndsWith,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
      FilterOperators.MinimumLength,
      FilterOperators.MaxiumumLength,
    ],
    size: "small",
  },
  {
    activeFilters: [],
    inputType: "text",
    name: "State",
    operators: [],
    propertyName: "state_current",
    sort: { sortable: false, direction: null },
    size: "small",
    filterable: false,
  },
  {
    activeFilters: [],
    name: "Node Count",
    propertyName: "node_count",
    inputType: "text",
    operators: [
      FilterOperators.GreaterThan,
      FilterOperators.GreaterThanOrEqual,
      FilterOperators.LessThan,
      FilterOperators.LessThanOrEqual,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
    ],
    sort: { sortable: true, direction: null },
    size: "small",
  },
  {
    activeFilters: [],
    name: "Submission Time",
    propertyName: "time_submission",
    inputType: "datetime",
    operators: [
      FilterOperators.GreaterThan,
      FilterOperators.GreaterThanOrEqual,
      FilterOperators.LessThan,
      FilterOperators.LessThanOrEqual,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
    ],
    sort: { sortable: true, direction: null },
    size: "large",
  },
  {
    activeFilters: [],
    name: "Time Limit",
    propertyName: "time_limit",
    inputType: "text",
    operators: [
      FilterOperators.GreaterThan,
      FilterOperators.GreaterThanOrEqual,
      FilterOperators.LessThan,
      FilterOperators.LessThanOrEqual,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
    ],
    sort: { sortable: true, direction: null },
    size: "small",
  },
  {
    activeFilters: [],
    name: "Start Time",
    propertyName: "time_start",
    inputType: "datetime",
    operators: [
      FilterOperators.GreaterThan,
      FilterOperators.GreaterThanOrEqual,
      FilterOperators.LessThan,
      FilterOperators.LessThanOrEqual,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
    ],
    sort: { sortable: true, direction: null },
    size: "medium",
  },
  {
    activeFilters: [],
    name: "End Time",
    propertyName: "time_end",
    inputType: "datetime",
    operators: [
      FilterOperators.GreaterThan,
      FilterOperators.GreaterThanOrEqual,
      FilterOperators.LessThan,
      FilterOperators.LessThanOrEqual,
      FilterOperators.Equals,
      FilterOperators.DoesNotEqual,
      FilterOperators.OneOf,
      FilterOperators.NotOneOf,
    ],
    sort: { sortable: true, direction: null },
    size: "medium",
  },
];
