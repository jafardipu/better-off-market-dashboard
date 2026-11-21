"use client";
import { useEffect, useState, type DragEvent } from "react";
import { HelpCircle, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { AddFaqModal } from "@/components/(adminDashboard)/modals/content/AddFaqModal";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useReorderFaqsMutation,
  useUpdateFaqMutation,
} from "@/redux/api/faqsApi";
import { message, Popconfirm } from "antd";
import { toast } from "sonner";
import FAQsSkeleton from "./FAQsSkeleton";
import { cn } from "@/lib/utils";

export interface FaqEntry {
  _id: string;
  question: string;
  answer: string;
  order?: number;
}

interface FaqEntriesSectionProps {
  faqs?: FaqEntry[];
}

export function FaqEntriesSection({}: FaqEntriesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("Add FAQ");
  const [selectedFaq, setSelectedFaq] = useState<FaqEntry | null>(null);
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [draggedFaqId, setDraggedFaqId] = useState<string | null>(null);
  const [dropTargetFaqId, setDropTargetFaqId] = useState<string | null>(null);

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const { data, isLoading } = useGetFaqsQuery({ limit: 100 });
  const [deleteFaq] = useDeleteFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [reorderFaqs, { isLoading: isReordering }] = useReorderFaqsMutation();

  useEffect(() => {
    const apiFaqs: FaqEntry[] = data?.data?.data ?? [];
    const ordered = [...apiFaqs].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER),
    );
    setFaqs(ordered);
  }, [data]);

  const handleEdit = (faq: FaqEntry) => {
    setTitle("Edit FAQ");
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const handleAddFaq = async (faq: FaqEntry) => {
    try {
      if (selectedFaq) {
        await updateFaq({
          id: selectedFaq._id,
          answer: faq.answer,
          question: faq.question,
        }).unwrap();
        message.success("Successfully updated FAQ");
        return;
      }
      await createFaq(faq).unwrap();
      message.success("Successfully added FAQ");
      setIsModalOpen(false);
    } catch (error: any) {
      message.error(error?.data?.message ?? "Failed to add FAQ");
    }
  };

  const confirm = async (id: string) => {
    toast.loading("Deleting FAQ...");
    try {
      await deleteFaq(id).unwrap();
      message.success("Successfully deleted FAQ");
      toast.dismiss();
    } catch (error: any) {
      message.error(error?.data?.message ?? "Failed to delete FAQ");
      toast.dismiss();
    }
  };

  const handleFaqDrop = async (
    event: DragEvent<HTMLDivElement>,
    targetId: string,
  ) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain") || draggedFaqId;
    setDraggedFaqId(null);
    setDropTargetFaqId(null);

    if (!draggedId || draggedId === targetId || isReordering) return;

    const sourceIndex = faqs.findIndex((faq) => faq._id === draggedId);
    const targetIndex = faqs.findIndex((faq) => faq._id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const previousFaqs = faqs;
    const reordered = [...faqs];
    const [movedFaq] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedFaq);

    const withOrder = reordered.map((faq, index) => ({
      ...faq,
      order: index + 1,
    }));
    setFaqs(withOrder);

    try {
      await reorderFaqs({
        orders: withOrder.map((faq) => ({
          id: faq._id,
          order: faq.order as number,
        })),
      }).unwrap();
      message.success("FAQ order updated");
    } catch (error: any) {
      setFaqs(previousFaqs);
      message.error(error?.data?.message ?? "Failed to reorder FAQs");
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle color="#00214C" className="size-5 text-primary-blue" />
          <div>
            <h2 className="text-lg font-bold text-primary-black">FAQ Entries</h2>
            <p className="text-xs text-gray-500">
              Drag the handle to rearrange the display order
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isReordering}
          className="flex items-center gap-1.5 rounded-md bg-[#00214C] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {isLoading ? (
        <FAQsSkeleton count={8} />
      ) : faqs.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          No FAQs yet. Add your first one.
        </p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDropTargetFaqId(faq._id);
              }}
              onDrop={(event) => handleFaqDrop(event, faq._id)}
              className={cn(
                "flex gap-3 rounded-2xl bg-gray-50 p-4 shadow-[0_5px_15px_0_rgba(15,23,42,0.03)] transition-shadow",
                dropTargetFaqId === faq._id && "ring-2 ring-[#00214C]/60",
                draggedFaqId === faq._id && "opacity-60",
              )}
            >
              <button
                type="button"
                draggable={!isReordering}
                disabled={isReordering}
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", faq._id);
                  event.dataTransfer.effectAllowed = "move";
                  setDraggedFaqId(faq._id);
                }}
                onDragEnd={() => {
                  setDraggedFaqId(null);
                  setDropTargetFaqId(null);
                }}
                className="mt-1 shrink-0 cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing disabled:cursor-not-allowed"
                aria-label={`Reorder FAQ: ${faq.question}`}
                title="Drag to reorder"
              >
                <GripVertical size={18} />
              </button>

              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#ECEEF0]">
                <HelpCircle color="#00214C" size={16} />
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#191C1E]">{faq.question}</p>
                <span className="mt-1 block text-sm text-gray-600">
                  {faq.answer}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-gray-400">
                <button
                  onClick={() => handleEdit(faq)}
                  disabled={isReordering}
                  className="hover:text-primary-black disabled:opacity-50"
                >
                  <Pencil color="#565E74" size={18} />
                </button>
                <Popconfirm
                  title="Delete the question"
                  description="Are you sure to delete this question?"
                  onConfirm={() => confirm(faq._id)}
                  okText="Yes"
                  cancelText="No"
                  disabled={isReordering}
                >
                  <button
                    disabled={isReordering}
                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddFaqModal
        title={title}
        setTitle={setTitle}
        selectedFaq={selectedFaq}
        setSelectedFaq={setSelectedFaq}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        disabled={isCreating || isReordering}
        onSubmit={(values) => {
          handleAddFaq(values as FaqEntry);
        }}
      />
    </div>
  );
}
