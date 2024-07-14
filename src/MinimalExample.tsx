import { useCallback, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_RowModel,
  MRT_RowSelectionState,
  MRT_VisibilityState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { data, type TableData } from "./makeData";
import { Box, useTheme } from "@mui/material";
import { customMuiSelectCheckboxProps_for_useRowSelectionWorkaround, handleColumnVisibilityChangeGenerator, MemoModeType, useRowSelectionWorkaround } from "./hooks/useRowSelectionWorkaround";
import { tableColumns } from "./mrtTableColumns";

const Example = () => {
  const theme = useTheme();
  const gridId = "demGrid_1";
  const columns = useMemo<MRT_ColumnDef<TableData>[]>(() => tableColumns, []);

  const [memoMode, setMemoMode] = useState<MemoModeType>("rows");
  const [rowSelectionState, setRowSelectionState] = useState<MRT_RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>({});

  const handleColumnVisibilityChange = useCallback(
    handleColumnVisibilityChangeGenerator({
      memoMode, setMemoMode, columnVisibility, setColumnVisibility
    }),
    [memoMode, setMemoMode, columnVisibility, setColumnVisibility]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableRowSelection: true,
    memoMode,
    initialState: {
      grouping: ["gender", "state"],
      pagination: { pageIndex: 0, pageSize: 100 },
    },
    onRowSelectionChange: setRowSelectionState,
    state: {
      rowSelection: rowSelectionState,
      columnVisibility: columnVisibility,
    },
    muiSelectCheckboxProps: ({ row }) =>
      customMuiSelectCheckboxProps_for_useRowSelectionWorkaround({ row }),
    onColumnVisibilityChange: handleColumnVisibilityChange,
  });

  /**
   * This is the hook whick does the visual selection
   */
  useRowSelectionWorkaround({
    isEnabled: memoMode === "rows" || memoMode === "table-body",
    gridId,
    rowSelectionState: { ...rowSelectionState }, // use the spread operator to trigger re-render
    colorPathChecked: theme.palette.primary.main, // theme.palette.action.active,
    colorPathBlank: theme.palette.action.active, // theme.palette.action.disabled,
    rowsGroupedRowModel: table.getGroupedRowModel() as MRT_RowModel<TableData>
  });

  return (
    <Box id={gridId}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default Example;
