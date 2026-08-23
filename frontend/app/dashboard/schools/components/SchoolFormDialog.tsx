'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createSchool, updateSchool } from '../api';
import type { SchoolListItem } from '../api';
import { useForm } from 'react-hook-form';
import { SchoolFormValues, SchoolSchema } from '../schemas/school.schema';
import { zodResolver } from '@hookform/resolvers/zod';
const defaultValues: SchoolFormValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    board: '',
    website: '',
};
interface EditSchoolDialogProps {
    school: SchoolListItem | null;
    open: boolean;
    onClose: () => void;
    onUpdated: (school: SchoolListItem) => void;
}

export function SchoolFormDialog({
    school,
    open,
    onClose,
    onUpdated,
}: EditSchoolDialogProps) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },

    } = useForm<SchoolFormValues>({
        resolver: zodResolver(SchoolSchema),
        defaultValues,
    })


    useEffect(() => {
        if (school) {
            reset({
                name: school.name ?? '',
                email: school.email ?? '',
                phone: school.phone ?? '',
                address: school.address ?? '',
                city: school.city ?? '',
                state: school.state ?? '',
                pincode: school.pincode ?? '',
                board: school.board ?? '',
                website: school.website ?? '',
            });
        } else {
            reset(defaultValues);
        }

    }, [school, reset]);


    const onSubmit = async (data: SchoolFormValues) => {
        try {
            const response = school ? await updateSchool(school._id, data) : await createSchool(data);
            if (!response.success) {
                toast.error(response.message || 'Failed to save school');
                return;
            }
            toast.success(
                response.message ||
                `School ${school ? 'updated' : 'created'} successfully`,
            );

            if (response.data) {
                onUpdated(response.data);
            }
            onClose();
        } catch (error) {

            console.error('Save school error:', error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while saving the school',
            );

        }
    }
    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{school ? 'Edit School' : 'Add School'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                School Name
                            </label>

                            <Input
                                {...register('name')}
                                placeholder="Enter school name"
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Email
                            </label>

                            <Input
                                type="email"
                                {...register('email')}
                                placeholder="Enter email"
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Phone
                            </label>

                            <Input
                                {...register('phone')}
                                placeholder="Enter phone number"
                                aria-invalid={!!errors.phone}
                            />
                            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Board
                            </label>

                            <Input
                                {...register('board')}
                                placeholder="Enter board"
                            />
                            {errors.board && <p className="text-sm text-red-600">{errors.board.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                City
                            </label>

                            <Input
                                {...register('city')}
                                placeholder="Enter city"
                                aria-invalid={!!errors.city}
                            />
                            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Address
                            </label>

                            <Input
                                {...register('address')}
                                placeholder="Enter address"
                            />
                            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                State
                            </label>
                            <Input
                                {...register('state')}
                                placeholder="Enter state"
                            />
                            {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Pincode
                            </label>

                            <Input
                                {...register('pincode')}
                                placeholder="Enter pincode"
                            />
                            {errors.pincode && <p className="text-sm text-red-600">{errors.pincode.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Address
                            </label>

                            <Input
                                {...register('address')}
                                placeholder="Enter address"
                            />
                            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website</label>
                            <Input
                                {...register('website')}
                                placeholder="https://example.com"
                            />
                            {errors.website && <p className="text-sm text-red-600">{errors.website.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : school ? 'Save Changes' : 'Create School'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}