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
import { generateDomDataFor_useMrtMemoModeRowsSelectionWorkaround, handleColumnVisibilityChangeGenerator, MemoModeType, useMrtMemoModeRowsSelectionWorkaround } from "./hooks/useMrtMemoModeRowsSelectionWorkaround";
import { tableColumns } from "./mrtTableColumns";

const Example = () => {
  const theme = useTheme();
  const gridId = "demGrid_1"; // Wrap the MRT table in a component with Id
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
    state: {
      rowSelection: rowSelectionState,
      columnVisibility: columnVisibility,
    },
    onRowSelectionChange: setRowSelectionState,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    muiSelectCheckboxProps: ({ row }) =>
      generateDomDataFor_useMrtMemoModeRowsSelectionWorkaround({ row }),
  });

  /**
   * This is the hook whick does the visual selection
   */
  useMrtMemoModeRowsSelectionWorkaround({
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
