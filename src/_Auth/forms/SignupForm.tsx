import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/Validation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";


const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();

  const { mutateAsync: signInAccount } =
    useSignInAccount();

  const formMethods = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
        
     
      if (newUser == null) {
        return   toast({title:"Please try signing up again"})
          
      } 
      
     

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    

    if (!session) {
      return toast({
        title: "Sign in during session creation failed. Please try again ",
      });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      formMethods.reset();
      navigate("/");
    } else {
      toast({ title: "Signup falied. Please try again" });
    }
  }

  return (
    <Form {...formMethods}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram enter your credentials
        </p>

        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={formMethods.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    type="text"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your username.</FormDescription>
                {formMethods.formState.errors.username && (
                  <p className="shad-form_message">
                    {formMethods.formState.errors.username.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    type="text"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                {formMethods.formState.errors.name && (
                  <p className="shad-form_message">
                    {formMethods.formState.errors.name.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                {formMethods.formState.errors.email && (
                  <p className="shad-form_message">
                    {formMethods.formState.errors.email.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                {formMethods.formState.errors.password && (
                  <p className="shad-form_message">
                    {formMethods.formState.errors.password.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser? (
              <div className="flex-center gap-2"><Loader>Loading...</Loader>  </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
