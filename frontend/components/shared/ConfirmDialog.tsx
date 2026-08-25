"use client";

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
}: ConfirmDialogProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsConfirming(true);
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={isConfirming ? undefined : onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isConfirming}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className={destructive ? 'bg-red-600 text-white hover:bg-red-700' : undefined}
                    >
                        {isConfirming ? 'Please wait...' : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
