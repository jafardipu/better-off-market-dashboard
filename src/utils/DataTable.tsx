"use client";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { Table } from "antd";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const DataTable = ({
  columns,
  data,
  pageSize,
  total,
  isLoading,
  emptyText,
  currentPage,
  onPageChange,
}: {
  columns: any;
  data: any;
  pageSize?: number;
  total?: number;
  isLoading?: boolean;
  emptyText?: ReactNode;
  // Pass both to keep the page in component state instead of ?page, e.g. a
  // table embedded in a page that has its own paginated list.
  currentPage?: number;
  onPageChange?: (page: number) => void;
}) => {
  const updateParams = useUpdateSearchParams();
  const page = useSearchParams()?.get("page") || "1";
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      locale={emptyText ? { emptyText } : undefined}
      pagination={
       ( pageSize && total! > pageSize)
          ? {
              pageSize,
              // Controlled by the URL so resetting ?page (search, filters,
              // back button) moves the pager too.
              current: currentPage ?? (Number(page) || 1),
              total: total ?? data?.length,
              onChange: (page) => {
                if (onPageChange) onPageChange(page);
                else updateParams({ page: page.toString() });
              },
            }
          : false
      }
      scroll={{ x: "max-content" }}
      rowKey={(record) => record._id ?? record.id ?? record.key}
    />
  );
};

export default DataTable;
