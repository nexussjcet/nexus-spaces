"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Tiptap from "./tiptap-dynamic";

export default function TextEditor() {
  const { data: session } = useSession();
  const { toast } = useToast();

  if (!session) {
    redirect("/signin");
  }

  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (newPost: z.infer<typeof formSchema>) => {
      return axios.post("/api/posts", newPost);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your post has been published.",
        variant: "default",
      });
      // Wait a brief moment for the toast to be visible before redirecting
      setTimeout(() => {
        router.push("/posts");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data);
  }

  return (
    <main className="p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="bg-transparent text-white w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter post title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Tiptap
                    description="Enter your post content here"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Publishing..." : "Submit"}
          </button>
        </form>
      </Form>
    </main>
  );
}
