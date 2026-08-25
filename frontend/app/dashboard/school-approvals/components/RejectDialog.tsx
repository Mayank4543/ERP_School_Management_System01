import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RejectSchoolSchema, type RejectSchoolFormValues } from "../schemas/reject-school.schema";

interface RejectSchoolDialogProps {
    open: boolean;
    schoolName?: string;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: RejectSchoolFormValues) => Promise<void>;
}
export function RejectSchoolDialog({
    open,
    schoolName,
    loading = false,
    onClose,
    onSubmit
}: RejectSchoolDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RejectSchoolFormValues>({
        resolver: zodResolver(RejectSchoolSchema),
        defaultValues: {
            reason: '',
        },
    });
    useEffect(() => {
        if (!open) {
            reset({
                reason: '',
            });
        }
    }, [open, reset]);
    return (
        <Dialog
            open={open} onOpenChange={(value) => {
                if (!value && !loading) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Reject School Approval
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                You are rejecting:
                            </p>
                            <p className="text-lg text-gray-900 font-medium">
                                {schoolName}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                Rejection Reason
                            </label>
                            <textarea
                                id="reason"
                                {...register('reason')}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.reason ? 'border-red-500' : ''}`}
                                rows={4}
                                disabled={loading}
                            />
                            {errors.reason && (
                                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading
                                ? 'Rejecting...'
                                : 'Reject Application'}
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>

        </Dialog>
    )
}
