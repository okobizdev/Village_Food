"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { UpdateFormStatus } from "./actions";

interface Props {
  id: string;
  status: boolean;
}

const FormSchema = z.object({
  statusInput: z.boolean(),
});

export function StatusSwitchForm({ id, status }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      statusInput: status,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await UpdateFormStatus(id, data.statusInput);
      if (res?.success) {
        toast({
          title: "Success",
          description: "Status updated successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed!",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="statusInput"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked); // Update the value
                    form.handleSubmit(onSubmit)(); // Trigger form submit
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
