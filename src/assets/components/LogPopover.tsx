//* Functions *//
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { Checkbox } from "../../../@/components/ui/checkbox";

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
import { MdOutlineEmail } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import {
  isUsernameTaken,
  classicLogin,
  getEmailFromUsername,
  getPlainError,
  classicSignUp,
  sendVerification,
  LoginWithGoogle,
} from "../../Config/Functions";
import { auth } from "../../Config/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

//* Props *//
type PopoverProps = {
  open: boolean;
  onClose: () => void;
};

function Popover({ open, onClose }: PopoverProps) {
  //* conditions *//
  const [ShowPasswordIcon, SetShowPasswordIcon] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [option, setOption] = useState("login");
  const [CreateAccError, setCreateAccError] = useState("");
  const [LoginError, setLoginError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [verifyError, setVerifyError] = useState("");

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
  }, [open, option]);

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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const CloseMenu = () => {
    menuRef.current?.hidePopover();
    onClose();
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
      email: "",
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

  const HandleLogin = async (data: z.infer<typeof LoginInSchema>) => {
    try {
      let email = data.both;
      if (!data.both.includes("@")) {
        const found = await getEmailFromUsername({
          username: data.both.toLowerCase(),
        });
        if (!found) {
          setLoginError("User doesn't exist");
          return;
        }
        email = found;
      }
      await classicLogin({ password: data.password, email: email });
      CloseMenu();
    } catch (error) {
      setLoginError(getPlainError(error));
    }
  };
  const HandleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    try {
      if (await isUsernameTaken(data.username)) {
        setCreateAccError("Username is already taken.");
        return;
      } else {
        await classicSignUp({
          password: data.password,
          email: data.email,
          username: data.username,
        });
        setSignedUpEmail(data.email);
        setOption("verify");
        try {
          sendVerification();
        } catch (error) {
          console.error("Error sending verification email:", error);
          setVerifyError(
            "Failed to send verification email. Please try again later.",
          );
        }
      }
    } catch (error) {
      setCreateAccError(getPlainError(error));
      console.log(error);
    }
  };
  useEffect(() => {
    if (option !== "verify") return;
    const timer = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        clearInterval(timer);
        CloseMenu();
        setOption("login");
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [option]);

  const ResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      sendPasswordResetEmail(auth, resetEmail);
      setIsSent(true);
    } catch (error) {
      setIsSent(false);
      setResetError(getPlainError(error));
    }
  };
  const SignInWithGoogle = async () => {
    const ok = await LoginWithGoogle();
    if (ok !== "true") {
      setLoginError(ok);
    } else {
      CloseMenu();
    }
  };

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
                className="LoginForm"
                onSubmit={LoginForm.handleSubmit(HandleLogin)}
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
                  <span>
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
                                type={"button"}
                              >
                                {ShowPasswordIcon ? (
                                  <IoEyeOutline />
                                ) : (
                                  <FaEyeSlash />
                                )}
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                          <p
                            className="forgotPassLink"
                            onClick={() => setOption("ResetPass")}
                          >
                            forgot password?
                          </p>
                          {LoginErrorField && (
                            <FieldError
                              errors={[
                                LoginForm.formState.errors[LoginErrorField]!,
                              ]}
                            />
                          )}
                          <span className="ErrorField">
                            {LoginError === undefined ||
                            LoginError === "" ? null : (
                              <Label className="text-sm font-normal text-destructive">
                                {LoginError}
                              </Label>
                            )}
                          </span>
                        </>
                      )}
                    ></Controller>
                  </span>
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
                        style={{ fontFamily: "Alexandria" }}
                        type="button"
                        onClick={() => SignInWithGoogle()}
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
      ) : option === "verify" ? (
        <div
          id="LoginPopOver"
          popover="auto"
          className="LoginPopOver"
          ref={menuRef}
        >
          <div className="LoginPopOverContainer">
            <div className="verifyContainer">
              <div className="verifyContainerInner">
                <Button
                  className="resendBtn sendBtn resendBtnBack"
                  type="button"
                  onClick={() => setOption("login")}
                >
                  <IoIosArrowBack />
                </Button>
                <span>
                  <div className="verify-icon">
                    <MdOutlineEmail />
                  </div>
                  <h1>Verify your email</h1>
                  <span>
                    <p>We send a verification email to </p>
                    <span className="email">{signedUpEmail}</span>
                  </span>
                  <Button className="resendBtn">Resend</Button>
                </span>
                <p>
                  Check your spam folder if you don't see it in a few minutes
                </p>
                {verifyError && <p style={{ color: "white" }}>{verifyError}</p>}
              </div>
            </div>
          </div>
        </div>
      ) : option == "ResetPass" ? (
        <div
          id="LoginPopOver"
          popover="auto"
          className="LoginPopOver"
          ref={menuRef}
          style={{
            width: `400px`,
            maxHeight: `420px`,
            overflow: "hidden",
          }}
        >
          <div className="LoginPopOverContainer">
            <div className="verifyContainer" style={{ maxHeight: `420px` }}>
              <div className="verifyContainerInner">
                <span>
                  <div className="verify-icon">
                    <MdOutlineEmail />
                  </div>
                  <h1>Reset your Password</h1>
                  <span>
                    <p>Enter email and we'll send a Reset email</p>
                  </span>
                  <form onSubmit={(e) => ResetPassword(e)}>
                    <InputGroup className="max-w-xs ResetInputPill InputPill">
                      <InputGroupInput
                        placeholder="Email"
                        className="InputPill"
                        type="text"
                        autoComplete="current-email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                      <InputGroupAddon>
                        <CiMail className="leftElementInputPill" />
                      </InputGroupAddon>
                    </InputGroup>
                    <span>
                      {resetError && (
                        <p style={{ color: "white" }}>{resetError}</p>
                      )}
                    </span>
                    <div className="ButtonsGridResetPop">
                      <Button
                        className="resendBtn sendBtn resendBtnSend"
                        type="submit"
                      >
                        {isSent ? "Resend" : "Send"}
                      </Button>
                      <Button
                        className="resendBtn sendBtn resendBtnBack"
                        type="button"
                        onClick={() => setOption("login")}
                      >
                        <IoIosArrowBack />
                      </Button>
                    </div>
                    <p>
                      Check your spam folder if you don't see it in a few
                      minutes
                    </p>
                  </form>
                </span>
              </div>
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
                className="LoginForm"
                onSubmit={SignInForm.handleSubmit(HandleSignUp)}
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
                              type="button"
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
                            <Label className="text-sm font-normal text-destructive">
                              {CreateAccError}
                            </Label>
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
