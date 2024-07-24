export type SortDetails = { sortable: boolean } & (
  | {
      sorted: true;
      direction: "asc" | "desc";
    }
  | {
      sorted: false;
      direction: null;
    }
);
