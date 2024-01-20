'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ICategory } from "@/types";
import { TransitionFunction, startTransition, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { createCategory, fetchAllCategories } from "@/lib/actions/category.action";



type DropdownProps = {
    value?: string;
    onChangeHandler?: () => void
}

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {

    const [categories, setCategories] = useState<ICategory[]>([])

    const [newCategory, setNewCategory] = useState('')

    const handleAddCategory = () => {
        createCategory({
            categoryName: newCategory.trim()
        })
            .then((category) => {
                setCategories((prevState) => [...prevState, category])
            })

    }

    useEffect(() => {
        const getCategories = async () => {
            const allCategories = await fetchAllCategories()
            allCategories && setCategories(allCategories as ICategory[])
        }

        getCategories()
    }, [])

    return (
        <Select onValueChange={onChangeHandler} defaultValue={value}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                {categories.length > 0 && categories.map((category) => (
                    <SelectItem key={category.categoryId} value={String(category.categoryId)} className='select-item p-regular-14'>{category.name}</SelectItem>
                ))}

                <AlertDialog>
                    <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus: text-primary-500">Add New Category</AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>New Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input type="text" placeholder="Category name" className="input-field mt-3" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => startTransition(handleAddCategory)}>Add</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>


            </SelectContent>
        </Select>

    )
}

export default Dropdown
