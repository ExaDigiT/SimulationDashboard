export function unpack(rows: { [key: string]: string }[], key: string) {
  return rows.map(function (row) {
    return row[key];
  });
}
