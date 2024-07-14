# MRT useRowSelectionWorkaround()

## Task

We needed a fast row selection feature for our table using MRT with 50-100 rows and 30+ columns, totaling up to 1500 cells. Enabling row selection in [MRT](https://www.material-react-table.com/) triggers a complete table re-render, which can take from one to three seconds or more, depending on the data. We know that [MUI](https://mui.com/material-ui/) isn't the most performant solution for such a large number of React components.

## Solution

We discovered that using [`rows` MRT's memo mode](https://www.material-react-table.com/docs/guides/memoization#memo-mode) allows for efficient background processing, but it doesn't update the UI. To address this, we implemented custom JavaScript on top of React, MUI, and MRT to dynamically update the UI. This led to the creation of the [useRowSelectionWorkaround() hook](https://github.com/pa4080/mrt-large-data-handling/blob/master/src/hooks/useRowSelectionWorkaround.ts) and its accompanying functions.

## Conclusion

The [useRowSelectionWorkaround() hook](https://github.com/pa4080/mrt-large-data-handling/blob/master/src/hooks/useRowSelectionWorkaround.ts) effectively handles row selection in `memoMode: 'rows'`, supports group row expansion, group selection in multi-level column group mode, and provides workarounds for showing or hiding columns in this memo mode.


## Resourcer

- The hook: [src/hooks/**useRowSelectionWorkaround**](https://github.com/pa4080/mrt-large-data-handling/blob/master/src/hooks/useRowSelectionWorkaround.ts)
- An example of usage: [src/**MinimalExample**.tsx](https://github.com/pa4080/mrt-large-data-handling/blob/master/src/MinimalExample.tsx)
- A bit extended exampple: [src/**ExtendedExample**.tsx](https://github.com/pa4080/mrt-large-data-handling/blob/master/src/TS.tsx)
- **CodeSandbox**: [pa4080/**mrt-large-data-handling**](https://codesandbox.io/p/github/pa4080/mrt-large-data-handling/master)


## References

- The initial state  of the repository was forked from this CodeSandbox: [material-react-table-example-advanced](https://codesandbox.io/p/devbox/material-react-table-example-advanced-93wiof)
- The inital state of the table was taken from the MRT Docs: [Column Grouping Example](https://www.material-react-table.com/docs/examples/column-grouping#column-grouping-example)

## Local dev

- `npm install` or `yarn`
- `npm run start` or `yarn start`
