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
}: {
  columns: any;
  data: any;
  pageSize?: number;
  total?: number;
  isLoading?: boolean;
  emptyText?: ReactNode;
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
              current: Number(page) || 1,
              total: total ?? data?.length,
              onChange: (page) => {
                updateParams({ page: page.toString()});
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
