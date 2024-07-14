import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { data, type Person } from "./makeData";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        header: "First Name",
        accessorKey: "firstName",
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
      },
      {
        header: "Age",
        accessorKey: "age",
      },
      {
        header: "Gender",
        accessorKey: "gender",
      },
      {
        header: "State",
        accessorKey: "state",
      },
      {
        header: "Salary",
        accessorKey: "salary",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
      },
      {
        header: "Address",
        accessorKey: "address",
      },
      {
        header: "Occupation",
        accessorKey: "occupation",
      },
      {
        header: "Hobbies",
        accessorKey: "hobbies",
      },
      {
        header: "Education",
        accessorKey: "education",
      },
      {
        header: "Favorite Color",
        accessorKey: "favoriteColor",
      },
      {
        header: "Favorite Food",
        accessorKey: "favoriteFood",
      },
      {
        header: "Favorite Movie",
        accessorKey: "favoriteMovie",
      },
      {
        header: "Favorite Book",
        accessorKey: "favoriteBook",
      },
      {
        header: "Favorite Song",
        accessorKey: "favoriteSong",
      },
      {
        header: "Favorite Vacation Spot",
        accessorKey: "favoriteVacationSpot",
      },
      {
        header: "Favorite Pet",
        accessorKey: "favoritePet",
      },
      {
        header: "Favorite Sport",
        accessorKey: "favoriteSport",
      },
      {
        header: "Favorite Number",
        accessorKey: "favoriteNumber",
      },
      {
        header: "Favorite Quote",
        accessorKey: "favoriteQuote",
      },
      {
        header: "Favorite Memory",
        accessorKey: "favoriteMemory",
      },
      {
        header: "Favorite Inspirational Quote",
        accessorKey: "favoriteInspirationalQuote",
      },
      {
        header: "Favorite Life Goal",
        accessorKey: "favoriteLifeGoal",
      },
      {
        header: "Favorite Dream Vacation",
        accessorKey: "favoriteDreamVacation",
      },
      {
        header: "Favorite Dream Car",
        accessorKey: "favoriteDreamCar",
      },
      {
        header: "Favorite Dream Home",
        accessorKey: "favoriteDreamHome",
      },
      {
        header: "Favorite Dream Partner",
        accessorKey: "favoriteDreamPartner",
      },
      {
        header: "Favorite Dream Holiday",
        accessorKey: "favoriteDreamHoliday",
      },
      {
        header: "Favorite Dream Job",
        accessorKey: "favoriteDreamJob",
      },
      {
        header: "Favorite Dream Travel Style",
        accessorKey: "favoriteDreamTravelStyle",
      },
      {
        header: "Favorite Dream Retirement",
        accessorKey: "favoriteDreamRetirement",
      },
    ],
    []
  );

  //demo state
  const [groupedColumnMode, setGroupedColumnMode] = useState<
    false | "remove" | "reorder"
  >("reorder"); //default is 'reorder

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    groupedColumnMode,
    enableRowSelection: true,
    initialState: {
      expanded: true, //expand all groups by default
      grouping: ["state", "gender"], //an array of columns to group by by default (can be multiple)
      pagination: { pageIndex: 0, pageSize: 100 },
    },
    muiTableContainerProps: { sx: { maxHeight: "800px" } },
  });

  return (
    <Stack gap="1rem">
      <DemoRadioGroup
        groupedColumnMode={groupedColumnMode}
        setGroupedColumnMode={setGroupedColumnMode}
      />
      <MaterialReactTable table={table} />
    </Stack>
  );
};

export default Example;

//demo...
const DemoRadioGroup = ({
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
          label='"reorder" (default)'
          value="reorder"
        />
        <FormControlLabel control={<Radio />} label='"remove"' value="remove" />
        <FormControlLabel value={false} control={<Radio />} label="false" />
      </RadioGroup>
    </FormControl>
  );
};
//end
