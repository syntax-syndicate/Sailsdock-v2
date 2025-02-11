"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/company/company-table/data-table-pagination";
import { getAllPeople } from "@/actions/people/get-all-people";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Person } from "./types";
import { DataTableToolbar } from "./data-table-toolbar";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialData: TData[];
  initialTotalCount: number;
}

export function PeopleTable<TData, TValue>({
  columns,
  initialData,
  initialTotalCount,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const defaultFilterValues = Object.entries(
    Object.fromEntries(searchParams)
  ).map(([key, value]) => ({ id: key, value: value ? value.split(",") : "" }));

  const [data, setData] = React.useState(initialData);
  const [totalCount, setTotalCount] = React.useState(initialTotalCount);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    defaultFilterValues ?? []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // !THIS USEEFFECT COMBINED WITH COLUMN.SETFILTERS IS UPDATING THE FILTERS TWICE - REMOVE IT AS SOON AS SERVER FILTERING IS ENABLED
  React.useEffect(() => {
    if (defaultFilterValues) {
      setColumnFilters(defaultFilterValues);
    }
  }, [searchParams]);
  // !THIS USEEFFECT COMBINED WITH COLUMN.SETFILTERS IS UPDATING THE FILTERS TWICE - REMOVE IT AS SOON AS SERVER FILTERING IS ENABLED

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { pageIndex, pageSize } = table.getState().pagination;
        const { data: newData, totalCount: newTotalCount } = await getAllPeople(
          pageSize,
          pageIndex + 1
        );
        if (newData) {
          setData(newData as TData[]);
          setTotalCount(newTotalCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
  ]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <DataTableToolbar table={table} data={data} />
      <ScrollArea className="flex-grow rounded-md border relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Laster data...
              </span>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-0.5 px-2 border w-min max-w-[300px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Ingen resultater.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} />
    </div>
  );
}
