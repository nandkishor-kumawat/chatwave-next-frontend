"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import PasswordInput from "@/components/form/password-input";
import { useState } from "react";
import Overlay from "@/components/loaders/overlay";
import { useRouter } from "next/navigation";
import Spinner from "@/components/loaders/spinner"
import { toast } from "sonner";
import { authActions } from "@/actions"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Please enter your full name.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export default function ProfileForm() {

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setIsLoading(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const { error, user } = await authActions.signUp(formData);

    if (error) {
      toast.error(error, {
        style: {
          color: 'red'
        },
      });
      setIsLoading(false)
      return
    }

    toast.success(`Logged in successfully`, {
      style: {
        color: 'green'
      },
    });

    router.replace('/chat');
    setIsLoading(false)

  }


  return (
    <div className="container max-w-md m-auto sm:my-32 my-28 px-3">
      {isLoading && <Overlay />}
      <h1 className="text-3xl font-bold my-4">Create your account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem aria-required>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your full Name" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <PasswordInput {...field} />
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <PasswordInput {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-3">
            <Button type="submit" className="text-lg w-full bg-orange-500 mt-3 hover:bg-orange-600">
              {isLoading && <Spinner className='w-5 h-5 mr-2 fill-blue-600' />}SignUp</Button>
          </div>
        </form>
      </Form>
      <div className="my-2">
        <div>
          <Link href="/login">Already have an account? Login</Link>
        </div>

      </div>
    </div>
  )
}
