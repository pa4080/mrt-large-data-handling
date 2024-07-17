import { ChangeEvent, MouseEvent, useCallback, useMemo, useState } from "react";
import {
  getMRT_RowSelectionHandler,
  MaterialReactTable,
  MRT_ExpandedState,
  MRT_Row,
  MRT_RowModel,
  MRT_RowSelectionState,
  MRT_TableInstance,
  MRT_Updater,
  MRT_VisibilityState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { data, type TableData } from "./makeData";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  SxProps,
  TableContainerProps,
  TableRowProps,
  Theme,
  useTheme,
} from "@mui/material";
import { generateDomDataFor_useMrtMemoModeRowsSelectionWorkaround, handleColumnVisibilityChangeGenerator, MemoModeType, useMrtMemoModeRowsSelectionWorkaround } from "./hooks/useMrtMemoModeRowsSelectionWorkaround";
import { tableColumns } from "./mrtTableColumns";

const Example = () => {
  const theme = useTheme();
  const gridId = "demGrid_1";
  const columns = useMemo<MRT_ColumnDef<TableData>[]>(() => tableColumns, []);

  const [memoMode, setMemoMode] = useState<MemoModeType>("rows");
  const [rowSelectionState, setRowSelectionState] = useState<MRT_RowSelectionState>({});
  const [groupedColumnMode, setGroupedColumnMode] = useState<false | "remove" | "reorder">("reorder");
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>({});

  const handleColumnVisibilityChange = useCallback(
    handleColumnVisibilityChangeGenerator({
      memoMode,
      setMemoMode,
      columnVisibility,
      setColumnVisibility
    }),
    [
      memoMode,
      setMemoMode,
      columnVisibility,
      setColumnVisibility
    ]
  );

  /**
   * Click on row for row selection
   */
  const customMuiTableBodyRowProps = useCallback(
    ({
      isDetailPanel,
      row,
      staticRowIndex,
      table
    }: {
      isDetailPanel?: boolean;
      row: MRT_Row<TableData>;
      staticRowIndex: number;
      table: MRT_TableInstance<TableData>;
    }) => {
      const sx: SxProps<Theme> = {
        maxHeight: 40,
        backgroundColor: theme.palette.background.paper,
        "& td::after":
          memoMode === "rows" || memoMode === "table-body"
            ? { backgroundColor: "transparent !important" }
            : {},
        cursor: "pointer"
      };

      let tableRowProps: TableRowProps = {
        sx: sx,
        onClick: (event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLTableRowElement>) =>
          getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event),
      };

      return tableRowProps;
    },
    [memoMode, theme.palette.background.paper]
  );

  const customMuiTableContainer = useCallback(
    ({ table }: { table: MRT_TableInstance<TableData>; }) => {
      const sx: SxProps<Theme> = {
        maxHeight: "600px",
        "& .Mui-selected": {
          backgroundColor: theme.palette.action.activatedOpacity,
        }
      };

      let tableContainerProps: TableContainerProps = {
        sx: sx
      };

      return tableContainerProps;
    },
    [memoMode, theme.palette.background.paper]
  );

  /**
   * Generate the MRT table instance
   */
  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    groupedColumnMode,
    enableRowSelection: true,
    memoMode,
    initialState: {
      grouping: ["state"],
      pagination: { pageIndex: 0, pageSize: 100 },
    },
    onRowSelectionChange: setRowSelectionState,
    state: {
      rowSelection: rowSelectionState,
      columnVisibility: columnVisibility,
    },
    muiSelectCheckboxProps: ({ row }) =>
      generateDomDataFor_useMrtMemoModeRowsSelectionWorkaround({ row }),
    muiTableContainerProps: ({ table }) => customMuiTableContainer({ table }),
    muiTableBodyRowProps: ({ isDetailPanel, row, staticRowIndex, table }) =>
      customMuiTableBodyRowProps({
        isDetailPanel,
        row,
        staticRowIndex,
        table
      }),
    onColumnVisibilityChange: handleColumnVisibilityChange,
  });

  /**
   * This is the hook whick does the visual selection
   */
  useMrtMemoModeRowsSelectionWorkaround({
    isEnabled: memoMode === "rows" || memoMode === "table-body",
    gridId,
    rowSelectionState: { ...rowSelectionState }, // use the spread operator to trigger re-render
    setRowSelectionState: setRowSelectionState,
    colorPathChecked: theme.palette.primary.main, // theme.palette.action.active,
    colorPathBlank: theme.palette.action.active, // theme.palette.action.disabled,
    rowsGroupedRowModel: table.getGroupedRowModel() as MRT_RowModel<TableData>
  });

  return (
    <Stack gap="1rem">
      <Stack gap="1rem" flexDirection="row">
        <DemoRadioGroup_memoMode
          memoMode={memoMode}
          setMemoMode={setMemoMode}
        />
        <DemoRadioGroup_columnMode
          groupedColumnMode={groupedColumnMode}
          setGroupedColumnMode={setGroupedColumnMode}
        />
      </Stack>
      <Box id={gridId}>
        <MaterialReactTable table={table} />
      </Box>
    </Stack>
  );
};

export default Example;

// Demo...
const DemoRadioGroup_columnMode = ({
  groupedColumnMode,
  setGroupedColumnMode,
}: {
  groupedColumnMode: false | "remove" | "reorder";
  setGroupedColumnMode: (
    groupedColumnMode: false | "remove" | "reorder"
  ) => void;
}) => {
  return (
    <FormControl sx={{ margin: "auto", textAlign: "center" }}>
      <FormLabel>Grouped Column Mode</FormLabel>
      <RadioGroup
        row
        value={groupedColumnMode}
        onChange={(event) =>
          setGroupedColumnMode(
            event.target.value === "false" ? false : (event.target.value as any)
          )
        }
      >
        <FormControlLabel
          control={<Radio />}
          label='"reorder"*'
          value="reorder"
        />
        <FormControlLabel control={<Radio />} label='"remove"' value="remove" />
        <FormControlLabel value={false} control={<Radio />} label="false" />
      </RadioGroup>
    </FormControl>
  );
};

const DemoRadioGroup_memoMode = ({
  memoMode,
  setMemoMode,
}: {
  memoMode: "cells" | "rows" | "table-body" | undefined;
  setMemoMode: (
    groupedColumnMode: "cells" | "rows" | "table-body" | undefined
  ) => void;
}) => {
  return (
    <FormControl sx={{ margin: "auto", textAlign: "center" }}>
      <FormLabel>Table Memo Mode</FormLabel>
      <RadioGroup
        row
        value={memoMode === undefined ? "undefined" : memoMode}
        onChange={(event) =>
          setMemoMode(
            event.target.value === "undefined" ? undefined : (event.target.value as any)
          )
        }
      >
        <FormControlLabel
          control={<Radio />}
          label='"rows"'
          value="rows"
        />
        <FormControlLabel
          control={<Radio />}
          label='"table-body"'
          value="table-body"
        />
        <FormControlLabel
          control={<Radio />}
          label='"cells"'
          value="cells"
        />
        <FormControlLabel
          control={<Radio />}
          label='undefined*'
          value='undefined'
        />
      </RadioGroup>
    </FormControl>
  );
};
// End
