import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

interface TableProps {
    columnsName: string[];
    columnsData: any[];
}

const MAX_ROWS = 5;

export default function Table({ columnsName, columnsData }: TableProps) {
    const [selectedRows, setSelectedRows] = useState(null);

    return (
        <div>
            <p>{selectedRows}</p>
            <DataTable
                value={columnsData}
                tableStyle={{ minWidth: '40rem' }}
                className="rounded-lg"
                stripedRows
                paginator
                rows={MAX_ROWS}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                emptyMessage="No items found."
                selectionMode="single"
                selection={selectedRows}
                onSelectionChange={(e) => setSelectedRows(e.value as any)}
            >
                {columnsName.map((column) => (
                    <Column
                        key={column}
                        field={column.toLowerCase()}
                        header={column}
                    />
                ))}
            </DataTable>

        </div>
    );
}