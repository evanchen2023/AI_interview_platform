import React from 'react';
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Controller} from "react-hook-form";

/*<T extends FieldValues>这样写的目的是确保穿进去的表单符合react-hook-form的要求*/
interface FormFieldProps <T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'
}
/*Controller: 主要是对表单进行管理*/
const FormField = ({control, name, label, placeholder, type = "text" }: FormFieldProps<T> ) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="label">{label}</FormLabel>
                <FormControl>
                    <Input
                        className="input"
                        placeholder= {placeholder}
                        type={type}  /*add this line, so that we cant see the real password from screen*/
                        {...field}
                    />
                </FormControl>

                <FormMessage />
            </FormItem>
        )}
    />
);

export default FormField;