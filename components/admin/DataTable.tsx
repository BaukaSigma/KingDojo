"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataTableProps<T> {
    columns: {
        header: string;
        accessorKey?: keyof T;
        cell?: (item: T) => React.ReactNode;
        className?: string;
    }[];
    data: T[];
    searchKey?: keyof T;
    onSearch?: (value: string) => void;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    searchKey,
}: DataTableProps<T>) {
    const [filter, setFilter] = useState("");

    // Client-side filtering if searchKey is provided and no onSearch prop
    // Ideally this would be server-side but for MVP client side is fine for < 1000 items
    const filteredData = searchKey
        ? data.filter(item =>
            String(item[searchKey]).toLowerCase().includes(filter.toLowerCase())
        )
        : data;

    return (
        <div className="space-y-4">
            {searchKey && (
                <div className="flex items-center gap-2 max-w-sm">
                    <Search className="h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Поиск..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                    />
                </div>
            )}
            <div className="rounded-md border border-neutral-800 bg-neutral-900/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-900">
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            {columns.map((col, i) => (
                                <TableHead key={i} className={`text-neutral-400 font-medium ${col.className || ""}`}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length ? (
                            filteredData.map((row) => (
                                <TableRow key={row.id} className="border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                    {columns.map((col, i) => (
                                        <TableCell key={i} className="text-neutral-200">
                                            {col.cell
                                                ? col.cell(row)
                                                : col.accessorKey
                                                    ? String(row[col.accessorKey])
                                                    : null
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-neutral-500">
                                    Нет данных.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-xs text-neutral-500">
                    Всего: {filteredData.length}
                </div>
            </div>
        </div>
    );
}
