import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { SignupValidation,SigninValidation } from "@/lib/Validation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import {

  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const SignInForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
  //   useCreateUserAccount();

  const { mutateAsync: signInAccount,} =
    useSignInAccount();

  const formMethods = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    // const newUser = await createUserAccount(values);
    // if (!newUser) {
    //   return toast({
    //     title: "Signup falied please tryy again",
    //   });
    // }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Cannot sign in Please try again ",
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
          Log into your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome,Please enter your details!
        </p>

        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          
         
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
            {isUserLoading? (
              <div className="flex-center gap-2"><Loader>Loading...</Loader>  </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Not a user?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              SignUp!
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
