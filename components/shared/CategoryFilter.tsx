'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchAllCategories } from "@/lib/actions/category.action"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { ICategory } from "@/types"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const CategoryFilter = () => {
    const [categories, setCategories] = useState<ICategory[]>([])
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const getCategories = async () => {
            const allCategories = await fetchAllCategories()
            allCategories && setCategories(allCategories as ICategory[])
        }

        getCategories()
    }, [])

    const onSelectCategory = (category: string) => {
        let newUrl = ''
        if (category && category !== 'All') {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'category',
                value: category
            })
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['category'],
            })
        }
        router.push(newUrl, { scroll: false })
    }

    return (
        <Select onValueChange={(value: string) => onSelectCategory(value)}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All" className="select-item p-regular-14">All</SelectItem>
                {categories.map(category => (
                    <SelectItem key={category.categoryId} value={String(category.categoryId)} className="select-item p-regular-14">{category.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}

export default CategoryFilter
