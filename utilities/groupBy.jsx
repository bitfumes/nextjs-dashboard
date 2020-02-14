export default function useGroupBy(items, key) {
  function groupBy(items, key) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item]
      }),
      {}
    );
  }
  return groupBy(items, key);
}
