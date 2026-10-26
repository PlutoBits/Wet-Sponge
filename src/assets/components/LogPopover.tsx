//* Functions *//
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { Button } from "../../../@/components/ui/button";
import { Label } from "../../../@/components/ui/label";
import { CardFooter } from "../../../@/components/ui/card";
import { Field } from "../../../@/components/ui/field";
import { FieldError } from "../../../@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../../@/components/ui/input-group";
import { Checkbox } from ".../../../@/components/ui/checkbox";
import { auth } from "../../Config/FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

//* Image Imports *//̥
import { Link } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import WetSpongeLogo from "../Wetsponge.webp";
import { PiStarFourFill } from "react-icons/pi";
import { PiUserCirclePlusDuotone } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";

//* Props *//
type PopoverProps = {
  open: boolean;
};

function Popover({ open }: PopoverProps) {
  //* conditions *//
  const [ShowPasswordIcon, SetShowPasswordIcon] = useState(false);
  const [option, setOption] = useState("login");
  // const [CreateAccError, SetCreateAccError] = useState("");
  const [CreateAccError] = useState("");

  //* UserDataStates *//
  const [AgredToTerms, SetAgredToTerms] = useState(false);

  //* Popover logic *//
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      menuRef.current.showPopover();
    } else {
      menuRef.current.hidePopover();
    }
  }, [open]);

  //* Poster logic
  const posters = Object.values(
    import.meta.glob("../posters/*.{png,jpg,jpeg,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  );
  const [randomPoster] = useState(
    posters[Math.floor(Math.random() * posters.length)],
  );

  //* AccountLog Logic *//
  const SingWithGoogle = async () => {};
  const signUp = async (data: z.infer<typeof signUpSchema>) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (firebaseError) {
      const error = firebaseError as { message: string };
      toast.error(`Error creating account: ${error.message}`);
    }
  };
  const Login = async (data: z.infer<typeof LoginInSchema>) => {
    if (isEmail(data.both)) {
      try {
        await signInWithEmailAndPassword(auth, data.both, data.password);
      } catch (firebaseError) {
        const error = firebaseError as { message: string };
        toast.error(`Error logging in: ${error.message}`);
      }
    } else {
      // Handle username login *later
    }
  };

  const LoginInSchema = z.object({
    both: z.union([
      z
        .string()
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must be at most 20 characters.")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores.",
        ),
      z.email("Invalid email address"),
    ]), // Allow either email or username
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[0-9]/, "Password must contain at least one number."),
  });
  const signUpSchema = z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must be at most 20 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    email: z.email(),
  });
  const LoginForm = useForm<z.infer<typeof LoginInSchema>>({
    resolver: zodResolver(LoginInSchema),
    defaultValues: {
      both: "",
      password: "",
    },
  });
  const SignInForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const LoginErrorField = LoginForm.formState.errors.both
    ? "both"
    : LoginForm.formState.errors.password
      ? "password"
      : null;
  const SignErrorField = SignInForm.formState.errors.username
    ? "username"
    : SignInForm.formState.errors.email
      ? "email"
      : SignInForm.formState.errors.password
        ? "password"
        : null;
  const isEmail = (value: string) => z.email().safeParse(value).success;

  // element *//
  return (
    <>
      {option === "login" ? (
        <div
          id="LoginPopOver"
          popover="auto"
          className="LoginPopOver"
          ref={menuRef}
        >
          <div className="LoginPopOverContainer">
            <div className="left">
              <div
                className="randomCharShowCase"
                style={{ backgroundImage: `url('${randomPoster}')` }}
              ></div>
              <div className="randomCharShowCaseContent">
                <span className="leftIcon">
                  <span className="leftIcon">
                    <img src={WetSpongeLogo} className="LogoIcon" />
                    <p>Wet Sponge</p>
                  </span>
                  <div className="charm">
                    <div className="charmLine"></div>
                    <div className="charmIcon">
                      <PiStarFourFill />
                    </div>
                  </div>
                </span>
                <div className="Text">
                  <p className="TextWelcome">WELCOME BACK</p>
                  <p className="TextDive">Dive back into stories.</p>
                  <div className="showcaseImageLine"></div>
                  <p className="TextSingIn">
                    Sign in to your Sponge account and continue your journey.
                  </p>
                  <p className="TextFounder">
                    PAIRIO / G7 <PiStarFourFill /> CREATING WORLDS, TOGETHER.
                  </p>
                </div>
              </div>
            </div>
            <div className="right">
              <span className="LoginPopOverTitle">
                <h1>Welcome Back</h1>
                <p>Sign in to your Sponge Account</p>
              </span>
              <form
                id="form-rhf-input"
                onSubmit={LoginForm.handleSubmit(Login)}
                className="LoginForm"
              >
                <span
                  className="LoginForm"
                  style={{ justifyContent: `normal` }}
                >
                  <Controller
                    name="both"
                    control={LoginForm.control}
                    render={({ field }) => (
                      <>
                        <Label>Username or Email</Label>
                        <InputGroup className="max-w-xs InputPill">
                          <InputGroupInput
                            {...field}
                            placeholder="Username or Email"
                            className="InputPill"
                            type="text"
                            autoComplete="current-username"
                          />
                          <InputGroupAddon>
                            <PiUserCirclePlusDuotone className="leftElementInputPill" />
                          </InputGroupAddon>
                        </InputGroup>
                      </>
                    )}
                  ></Controller>
                  <Controller
                    name="password"
                    control={LoginForm.control}
                    render={({ field }) => (
                      <>
                        <Label>Password</Label>
                        <InputGroup className="max-w-xs InputPill">
                          <InputGroupInput
                            {...field}
                            placeholder="Password"
                            className="InputPill"
                            type={ShowPasswordIcon ? "text" : "password"}
                            autoComplete="current-password"
                          />
                          <InputGroupAddon>
                            <MdOutlinePassword className="leftElementInputPill" />
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <Button
                              className="rightElementInputPill"
                              onClick={() =>
                                SetShowPasswordIcon(!ShowPasswordIcon)
                              }
                              style={{
                                background: `#00000000`,
                              }}
                            >
                              {ShowPasswordIcon ? (
                                <IoEyeOutline />
                              ) : (
                                <FaEyeSlash />
                              )}
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                        {LoginErrorField && (
                          <FieldError
                            errors={[
                              LoginForm.formState.errors[LoginErrorField]!,
                            ]}
                          />
                        )}
                      </>
                    )}
                  ></Controller>
                </span>
                <div className="orBorder"></div>
                <span>
                  <CardFooter>
                    <Field orientation="vertical">
                      <Button
                        type="submit"
                        form="form-rhf-input"
                        className={"SignInButton"}
                        style={{
                          background: `white`,
                          color: `black`,
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="SignInButton"
                        onClick={SingWithGoogle}
                        style={{ fontFamily: "Alexandria" }}
                        type="button"
                      >
                        <i className="fa-brands fa-google" />
                        Sign In With Google
                      </Button>
                      <span className="LoginPopOverfooter">
                        <Label>Don't have an Sponge account?</Label>
                        <Link to={"#"} onClick={() => setOption("SingUp")}>
                          Sign Up
                          <IoIosArrowForward />
                        </Link>
                      </span>
                    </Field>
                  </CardFooter>
                </span>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="LoginPopOver"
          popover="auto"
          className="LoginPopOver"
          ref={menuRef}
        >
          <div className="LoginPopOverContainer">
            <div className="left">
              <div
                className="randomCharShowCase"
                style={{ backgroundImage: `url('${randomPoster}')` }}
              ></div>
              <div className="randomCharShowCaseContent">
                <span className="leftIcon">
                  <span className="leftIcon">
                    <img src={WetSpongeLogo} className="LogoIcon" />
                    <p>Wet Sponge</p>
                  </span>
                  <div className="charm">
                    <div className="charmLine"></div>
                    <div className="charmIcon">
                      <PiStarFourFill />
                    </div>
                  </div>
                </span>
                <div className="Text">
                  <p className="TextWelcome">WELCOME TO WET SPONGE</p>
                  <p className="TextDive">Dive into stories.</p>
                  <div className="showcaseImageLine"></div>
                  <p className="TextSingIn">
                    Create an Sponge account and start your journey.
                  </p>
                  <p className="TextFounder">
                    PAIRIO / G7 <PiStarFourFill /> CREATING WORLD, TOGETHER.
                  </p>
                </div>
              </div>
            </div>
            <div className="right">
              <span className="LoginPopOverTitle">
                <h1>Welcome</h1>
                <p>Create your Sponge Account</p>
              </span>
              <form
                id="form-rhf-input"
                onSubmit={SignInForm.handleSubmit(signUp)}
                className="LoginForm"
              >
                <span
                  className="LoginForm"
                  style={{ justifyContent: `normal` }}
                >
                  <Controller
                    name="username"
                    control={SignInForm.control}
                    render={({ field }) => (
                      <>
                        <Label>Username</Label>
                        <InputGroup className="max-w-xs InputPill">
                          <InputGroupInput
                            {...field}
                            placeholder="Username"
                            className="InputPill"
                            type="text"
                            autoComplete="current-username"
                          />
                          <InputGroupAddon>
                            <PiUserCirclePlusDuotone className="leftElementInputPill" />
                          </InputGroupAddon>
                        </InputGroup>
                      </>
                    )}
                  ></Controller>
                  <Controller
                    name="email"
                    control={SignInForm.control}
                    render={({ field }) => (
                      <>
                        <Label>Email</Label>
                        <InputGroup className="max-w-xs InputPill">
                          <InputGroupInput
                            {...field}
                            placeholder="Email"
                            className="InputPill"
                            type="text"
                            autoComplete="current-email"
                          />
                          <InputGroupAddon>
                            <CiMail className="leftElementInputPill" />
                          </InputGroupAddon>
                        </InputGroup>
                      </>
                    )}
                  ></Controller>
                  <Controller
                    name="password"
                    control={SignInForm.control}
                    render={({ field }) => (
                      <>
                        <Label>Password</Label>
                        <InputGroup className="max-w-xs InputPill">
                          <InputGroupInput
                            {...field}
                            placeholder="Password"
                            className="InputPill"
                            type={ShowPasswordIcon ? "text" : "password"}
                            autoComplete="current-password"
                          />
                          <InputGroupAddon>
                            <MdOutlinePassword className="leftElementInputPill" />
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <Button
                              className="rightElementInputPill"
                              onClick={() =>
                                SetShowPasswordIcon(!ShowPasswordIcon)
                              }
                              style={{
                                background: `#00000000`,
                              }}
                            >
                              {ShowPasswordIcon ? (
                                <IoEyeOutline />
                              ) : (
                                <FaEyeSlash />
                              )}
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                        {SignErrorField && (
                          <FieldError
                            errors={[
                              SignInForm.formState.errors[SignErrorField]!,
                            ]}
                          />
                        )}
                        <span className="ErrorField">
                          {CreateAccError === undefined ||
                          CreateAccError === "" ? null : (
                            <Label>{CreateAccError}</Label>
                          )}
                        </span>
                      </>
                    )}
                  ></Controller>
                </span>
                <span className="Agree">
                  <Checkbox
                    checked={AgredToTerms}
                    onCheckedChange={(value) => {
                      SetAgredToTerms(value);
                    }}
                  ></Checkbox>
                  <Label>
                    I Agree to the
                    <Link
                      to={"/Terms"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of conditions
                    </Link>
                  </Label>
                </span>
                <div className="Border"></div>
                <span>
                  <CardFooter>
                    <Field orientation="vertical">
                      <Button
                        type="submit"
                        form="form-rhf-input"
                        disabled={!AgredToTerms}
                        className="SignInButton"
                        style={
                          AgredToTerms
                            ? { color: `black`, background: `white` }
                            : {}
                        }
                      >
                        Create
                      </Button>
                      <span className="LoginPopOverfooter">
                        <Label>Already have an Sponge account? </Label>
                        <Link to={"#"} onClick={() => setOption("login")}>
                          Sign In
                          <IoIosArrowForward />
                        </Link>
                      </span>
                    </Field>
                  </CardFooter>
                </span>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Popover;
