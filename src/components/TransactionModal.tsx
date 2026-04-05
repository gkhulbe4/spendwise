"use client";

import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Transaction } from "@prisma/client";
import { useStore } from "@/store/useStore";
import { format, setHours, setMinutes, getHours, getMinutes } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-transactions-query";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  transaction,
}: TransactionModalProps) {
  const { addTransaction, updateTransaction } = useStore();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const loading = createMutation.isPending || updateMutation.isPending;
  const [error, setError] = useState("");

  // Separate states for better control
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Misc");
  const [type, setType] = useState("Expense");
  const [status, setStatus] = useState("Pending");

  // Date and Time components
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [amPm, setAmPm] = useState("AM");

  useEffect(() => {
    if (transaction && isOpen) {
      const d = new Date(transaction.date);
      setTitle(transaction.title);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setType(transaction.type);
      setStatus(transaction.status);
      setSelectedDate(d);

      let h = getHours(d);
      const isPm = h >= 12;
      const displayHour = h % 12 || 12;
      setHour(displayHour.toString());
      setMinute(getMinutes(d).toString().padStart(2, "0"));
      setAmPm(isPm ? "PM" : "AM");
    } else if (isOpen) {
      setTitle("");
      setAmount("");
      setCategory("Misc");
      setType("Expense");
      setStatus("Pending");
      const d = new Date();
      setSelectedDate(d);
      let h = getHours(d);
      const isPm = h >= 12;
      const displayHour = h % 12 || 12;
      setHour(displayHour.toString());
      setMinute(getMinutes(d).toString().padStart(2, "0"));
      setAmPm(isPm ? "PM" : "AM");
    }
    setError("");
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    setError("");

    let h = parseInt(hour);
    if (amPm === "PM" && h < 12) h += 12;
    if (amPm === "AM" && h === 12) h = 0;

    const finalDate = setMinutes(setHours(selectedDate, h), parseInt(minute));

    const payload = {
      title,
      amount: parseFloat(amount),
      category,
      type,
      status,
      date: finalDate.toISOString(),
    };

    try {
      if (transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">
            {transaction ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software subscription"
            />
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                required
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="12"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="w-full"
                placeholder="HH"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => setMinute(e.target.value.padStart(2, "0"))}
                className="w-full"
                placeholder="MM"
              />
              <Select value={amPm} onValueChange={(val) => val && setAmPm(val)}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(val) => val && setType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(val) => val && setCategory(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Misc">Misc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val) => val && setStatus(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Transaction"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
