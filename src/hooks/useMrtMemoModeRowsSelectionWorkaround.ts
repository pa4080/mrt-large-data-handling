/**
 * For simplified example of usage
 * @see https://github.com/pa4080/mrt-large-data-handling
 */
import {
  MRT_Row,
  MRT_RowData,
  MRT_RowModel,
  MRT_RowSelectionState,
  MRT_Updater,
  MRT_VisibilityState,
} from "material-react-table";
import { useEffect } from "react";

/**
 * This is the hook's interface
 */
interface useMrtMemoModeRowsSelectionWorkaroundProps<
  TableData extends MRT_RowData
> {
  gridId: string;
  rowSelectionState: MRT_RowSelectionState; // pass a copy to this prop { ...rowSelectionState }
  setRowSelectionState?: (newState: MRT_RowSelectionState) => void; // This could be dangerous and you may need to implement it in a different way
  isEnabled: boolean;
  rowsGroupedRowModel: MRT_RowModel<TableData>;
  selectedRowClassName?: string;
  colorPathChecked?: string;
  colorPathBlank?: string;
}

/**
 * This is the actual hook, it must be placed after the MRT table generation
 */
export function useMrtMemoModeRowsSelectionWorkaround<
  TableData extends MRT_RowData
>({
  gridId,
  rowSelectionState,
  setRowSelectionState,
  isEnabled,
  rowsGroupedRowModel,
  selectedRowClassName = "Mui-selected",
  colorPathChecked = "#0B91FA",
  colorPathBlank = "#4c4e6499",
}: useMrtMemoModeRowsSelectionWorkaroundProps<TableData>) {
  const svgPath_SemiChecked = `<path style="color:${colorPathChecked};" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />`;
  const svgPath_Checked = `<path style="color:${colorPathChecked};" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />`;
  const svgPath_Blank = `<path style="color:${colorPathBlank};"  d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />`;

  useEffect(() => {
    try {
      if (!isEnabled || !window?.document) {
        return;
      }

      // Get the tows which are groups if they exist
      const groupRows = rowsGroupedRowModel?.flatRows.filter((row) =>
        Number.isNaN(Number(row.id))
      );
      const groupRowsObj = groupRows
        ? groupRows.reduce(
            (
              acc: Record<string, MRT_Row<TableData>>,
              curr: MRT_Row<TableData>
            ) => ((acc[curr.id] = curr), acc),
            {}
          )
        : {};

      // Get the DOM table rows as an array
      const rowsDom = document.querySelectorAll<HTMLElement>(
        `#${gridId} tbody > tr`
      );

      if (!rowsDom) {
        return;
      }

      // Manipulate the DOM table rows
      rowsDom.forEach((row, index, rows) => {
        // Get the row data, passed via the method 'muiSelectCheckboxProps()' of the MRT's table
        const rowCheckbox =
          row.querySelector<HTMLElement>("td > [data-row-id]");
        const rowId = rowCheckbox?.dataset.rowId;
        const rowCanExpand = rowCheckbox?.getAttribute("data-row-can-expand");
        const rowHasParent = rowCheckbox?.getAttribute("data-row-has-parent");

        if (!rowId) {
          return;
        }

        /**
         * Deal with the expand/collapse buttons
         */
        if (rowCanExpand === "true") {
          let isExpanded = true;

          if (index === rows.length - 1) {
            isExpanded = false;
          } else {
            const nextRow_1 = rows[index + 1];
            const nextRow_1_Checkbox =
              nextRow_1?.querySelector<HTMLElement>("td > [data-row-id]");
            const nextRow_1_CanExpand = nextRow_1_Checkbox?.getAttribute(
              "data-row-can-expand"
            );

            if (
              nextRow_1 &&
              nextRow_1_CanExpand &&
              nextRow_1_CanExpand === "true"
            ) {
              const nextRow_1_HasParent = nextRow_1_Checkbox?.getAttribute(
                "data-row-has-parent"
              );

              if (nextRow_1_HasParent && nextRow_1_HasParent !== "true") {
                isExpanded = false;
              }

              if (rowHasParent && rowHasParent === "true") {
                isExpanded = false;
              }
            }

            const nextRow_1_rowId = nextRow_1_Checkbox?.dataset.rowId;

            if (nextRow_1_rowId) {
              const currentRowObj = groupRowsObj[rowId];
              const currentRow_1_Obj = groupRowsObj[nextRow_1_rowId];

              if (
                currentRowObj &&
                currentRow_1_Obj &&
                currentRow_1_Obj.depth > currentRowObj.depth
              ) {
                isExpanded = true;
              }
            }
          }

          let expandIconSvg = row.querySelector<HTMLElement>(
            'td > span > button[aria-label="Expand"] > svg'
          );

          if (!expandIconSvg) {
            expandIconSvg = row.querySelector<HTMLElement>(
              'td > span > button[aria-label="Collapse"] > svg'
            );
          }

          if (expandIconSvg) {
            expandIconSvg.style.transform = `rotate(${
              isExpanded ? -180 : 0
            }deg)`;
          }
        }

        /**
         * Deal with the checkboxes of the LeafRows
         */
        if (!rowSelectionState) {
          return;
        }

        // Get the SVG of the checkbox
        const svgCheck = rowCheckbox?.querySelector("svg");

        // Check does the elements to be manipulated exist
        if (!svgCheck || !rowId || !rowCheckbox) {
          return;
        }

        // If the rowId is literal string it is a group, check
        // the method 'muiSelectCheckboxProps()' of the MRT's table
        if (!Number.isNaN(Number(rowId)) || rowCanExpand !== "true") {
          if (rowId in rowSelectionState) {
            // For the checked LeafRows rows
            row.classList.add(selectedRowClassName);
            svgCheck.innerHTML = svgPath_Checked;
          } else {
            // For the unchecked LeafRows rows
            row.classList.remove(selectedRowClassName);
            svgCheck.innerHTML = svgPath_Blank;
          }
        }
      });

      /**
       * Deal with the checkboxes of the Groups,
       * Find the groups within rowsGroupedRowModel and iterate over them.
       */

      // Handle remove empty groups from the state
      let shouldUpdateTheState = false;
      // const newRowSelectionState = { ...rowSelectionState }; // Wea are apping a copy of the state to the hook

      // Process the groups
      groupRows?.forEach((groupRowData) => {
        const groupLeafRows = groupRowData.getLeafRows();
        const isWholeGrSelected = groupLeafRows.every(
          (leafRow) => leafRow.id in rowSelectionState
        );
        const isRowLeafSelected = groupLeafRows.some(
          (leafRow) => leafRow.id in rowSelectionState
        );
        const isRowLeafOnlyGroups = groupLeafRows
          .filter((leafRow) => leafRow.id in rowSelectionState)
          .every((leafRow) => Number.isNaN(Number(leafRow.id)));

        const rowData_DomSelector = `#${gridId} tbody > tr > td > [data-row-id="${groupRowData.id}"]`;
        const rowDomCheckbox =
          document.querySelector<HTMLElement>(rowData_DomSelector);
        const svgCheck = rowDomCheckbox?.querySelector("svg");
        const rowDom = rowDomCheckbox?.closest("tr");

        if (!svgCheck || !rowDom) {
          return;
        }

        if (isWholeGrSelected) {
          // For the checked Group rows (fully selected)
          rowDom.classList.add(selectedRowClassName);
          svgCheck.innerHTML = svgPath_Checked;
        } else if (isRowLeafSelected && !isRowLeafOnlyGroups) {
          // For the checked Group rows (partially selected)
          rowDom.classList.remove(selectedRowClassName);
          svgCheck.innerHTML = svgPath_SemiChecked;
        } else {
          // For the unchecked Group rows
          rowDom.classList.remove(selectedRowClassName);
          svgCheck.innerHTML = svgPath_Blank;
        }

        // Handle remove empty groups from the state
        if (isRowLeafOnlyGroups) {
          shouldUpdateTheState = true;
          delete rowSelectionState[groupRowData.id]; // delete newRowSelectionState[groupRowData.id];
        }
      });

      // Handle remove empty groups from the state
      if (shouldUpdateTheState && setRowSelectionState) {
        // This could be dangerous and you may need to implement it in a different way
        setRowSelectionState(rowSelectionState); // setRowSelectionState(newRowSelectionState);
      }
    } catch (error) {
      console.error(
        "Something went wrong with useMrtMemoModeRowsSelectionWorkaround(): ",
        error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridId, isEnabled, rowsGroupedRowModel, rowSelectionState]);
}

/**
 * This data is used within the hooh whick does the visual selection
 */
export function generateDomDataFor_useMrtMemoModeRowsSelectionWorkaround<
  TableData extends MRT_RowData
>({ row }: { row: MRT_Row<TableData> }) {
  return {
    // id: is will become HTML id for input[type="checkbox"], but we re using the "data-row-id" for now...
    // We are using this "data-row-id" for the row selection within the hook 'useMrtMemoModeRowsSelectionWorkaround()'
    id: String(row.id),
    "data-row-id": row.groupingColumnId
      ? row.parentId
        ? `${row.parentId}>${row.groupingColumnId}:${row.groupingValue}`
        : `${row.groupingColumnId}:${row.groupingValue}`
      : row.id,
    "data-row-can-expand": row.getCanExpand(),
    "data-row-has-parent": row.parentId ? "true" : "false",
  };
}

/**
 * This is a workaround, which allow us to rerender the table,
 * for wxample when we show hide a column...
 * > const [memoMode, setMemoMode] = useState<MemoModeType>("rows");
 */
export type MemoModeType = "cells" | "rows" | "table-body" | undefined;
export const forceTableRerender = ({
  memoMode,
  setMemoMode,
}: {
  memoMode: MemoModeType;
  setMemoMode: (memoMode: MemoModeType) => void;
}) => {
  if (memoMode === "rows") {
    setMemoMode("table-body");

    setTimeout(() => {
      setMemoMode("rows");
    }, 150);
  }
};

/**
 * This is the second part of the table re-render
 * workaround. You may need to implement your own
 * handleColumnVisibilityChange whiten your grid components.
 * > const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>({});
 */
export const handleColumnVisibilityChangeGenerator = ({
  memoMode,
  setMemoMode,
  columnVisibility,
  setColumnVisibility,
}: {
  memoMode: MemoModeType;
  setMemoMode: (memoMode: MemoModeType) => void;
  columnVisibility: MRT_VisibilityState;
  setColumnVisibility: (columnVisibility: MRT_VisibilityState) => void;
}) => {
  return (updater: MRT_Updater<MRT_VisibilityState>) => {
    const newColumnVisibility: MRT_VisibilityState =
      updater instanceof Function ? updater(columnVisibility) : updater;

    setColumnVisibility(newColumnVisibility);
    forceTableRerender({ memoMode, setMemoMode });
  };
};
