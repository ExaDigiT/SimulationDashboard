export type SortDetails =
  | {
      sorted: true;
      direction: "asc" | "desc";
    }
  | {
      sorted: false;
      direction: null;
    };
