import React from 'react';
import {FormControl, FormDescription, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Controller} from "react-hook-form";

interface FormFieldProps <T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({control, name, label, placeholder, type = "text" }: FormFieldProps<T> ) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="label">Username here</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                    This is your public display name.
                </FormDescription>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default FormField;