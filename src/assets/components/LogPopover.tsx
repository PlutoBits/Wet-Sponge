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
import { auth } from "../../Config/FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";

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

//* Props *//
type PopoverProps = {
  open: boolean;
  backdropRef: React.RefObject<HTMLDivElement | null>;
};

async function getEmailFromUsername({ username }: { username: string }) {
  const q = query(
    collection(db, "publicUserInfo"),
    where("username", "==", username),
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }
  const email = snap.docs[0].data().email;
  return email;
}
const sendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

function Popover({ open, backdropRef }: PopoverProps) {
  //* conditions *//
  const [ShowPasswordIcon, SetShowPasswordIcon] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [option, setOption] = useState("login");
  const [CreateAccError, SetCreateAccError] = useState("");
  const [LoginError, SetLoginError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, SetResetError] = useState("");
  const [isSent, SetSent] = useState(false);

  //* UserDataStates *//
  const [AgredToTerms, SetAgredToTerms] = useState(false);

  //* Popover logic *//
  const closeMenu = () => {
    menuRef.current?.hidePopover();
    backdropRef.current?.classList.remove("barrier");
  };
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      menuRef.current.showPopover();
    } else {
      menuRef.current.hidePopover();
    }
  }, [open, option]);

  async function SetUpUser({
    uid,
    username,
    email,
  }: {
    uid: string;
    username: string;
    email: string;
  }): Promise<boolean> {
    const userRef = doc(db, "User", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) return true;

    if (await isUsernameTaken(username)) {
      SetCreateAccError("Username is taken");
      return false;
    }

    await setDoc(userRef, {
      displayName: username,
      username: username.toLowerCase(),
      email: email,
      createdAt: new Date(),
    });
    await setDoc(doc(db, "publicUserInfo", uid), {
      displayName: username,
      username: username.toLowerCase(),
      email: email,
    });
    return true;
  }

  async function isUsernameTaken(username: string) {
    const q = query(
      collection(db, "publicUserInfo"),
      where("username", "==", username.toLowerCase()),
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }

  const ResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(resetEmail)) {
      SetResetError("Enter your email first to reset your password.");
      SetSent(false);
      return;
    } else {
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        SetResetError("Password reset email sent, check your inbox.");
        SetSent(true);
      } catch (error) {
        const InsuError = error as { code?: string };
        if (InsuError.code === "auth/user-not-found") {
          SetResetError("User doesn't exist.");
        } else if (InsuError.code === "auth/too-many-requests") {
          SetResetError("Too many attempts.");
        } else {
          SetResetError("Something went wrong, try again.");
        }
      }
    }
  };

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
  useEffect(() => {
    if (option == "verify") {
      sendVerification();
    }
  }, [option]);
  useEffect(() => {
    if (option !== "verify") return;
    const check = async () => {
      if (!auth.currentUser) return;
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        closeMenu();
      }
    };
    const id = setInterval(check, 3000);
    return () => clearInterval(id);
  }, [option]);

  //* AccountLog Logic *//
  const SingWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const username = user.displayName
        ? user.displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_")
        : user.email!.split("@")[0];
      const ok = await SetUpUser({
        uid: user.uid,
        username: username,
        email: user.email!,
      });
      if (!ok) return;
      closeMenu();
    } catch (error) {
      const err = error as { code: string; message: string };
      console.error(err.message);
      if (err.code === "auth/popup-closed-by-user") {
        SetLoginError("Sign-in cancelled.");
      } else if (err.code === "auth/popup-blocked") {
        SetLoginError("Allow pop-ups for this site, then try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        SetLoginError("Something went wrong, try again.");
      } else {
        SetLoginError("Something went wrong, try again.");
      }
    }
  };
  const signUp = async (data: z.infer<typeof signUpSchema>) => {
    if (await isUsernameTaken(data.username)) {
      SetCreateAccError("Username is taken");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      setSignedUpEmail(data.email);
      try {
        const ok = await SetUpUser({
          uid: userCredential.user.uid,
          username: data.username,
          email: data.email,
        });
        if (!ok) return;
        setOption("verify");
      } catch (firebaseError) {
        console.error(firebaseError);
        SetCreateAccError("Couldn't save your profile, try again.");
      }
    } catch (firebaseError) {
      const error = firebaseError as { message: string; code?: string };
      console.error(`Error creating account: ${error.message}`);
      if (error.code === "auth/email-already-in-use") {
        SetCreateAccError("Email in use.");
      } else if (error.code === "auth/operation-not-allowed") {
        SetCreateAccError("Operation rejected.");
      } else if (error.code === "auth/network-request-failed") {
        SetCreateAccError("Database can't be reached.");
      } else {
        SetCreateAccError("Something went wrong, try again later.");
      }
    }
  };
  const Login = async (data: z.infer<typeof LoginInSchema>) => {
    if (isEmail(data.both)) {
      try {
        await signInWithEmailAndPassword(auth, data.both, data.password);
        closeMenu();
      } catch (firebaseError) {
        const error = firebaseError as { message: string; code?: string };
        console.error(`Error logging in: ${error.message}`);
        if (error.code === "auth/user-not-found") {
          SetLoginError("User doesn't exist.");
        } else if (error.code === "auth/invalid-credential") {
          SetLoginError("Wrong email or password or User doesn't exist.");
        } else if (error.code === "auth/too-many-requests") {
          SetLoginError("Too many attempts.");
        } else {
          SetLoginError("Something went wrong, try again.");
        }
      }
    } else {
      try {
        const email = await getEmailFromUsername({
          username: data.both.toLowerCase(),
        });
        if (!email) {
          SetLoginError("User doesn't exist.");
          return;
        }
        await signInWithEmailAndPassword(auth, email, data.password);
        closeMenu();
      } catch (firebaseError) {
        const error = firebaseError as { message: string; code?: string };
        console.error(`Error logging in: ${error.message}`);
        if (error.code === "auth/invalid-credential") {
          SetLoginError("Wrong email or password or User doesn't exist.");
        } else if (error.code === "auth/too-many-requests") {
          SetLoginError("Too many attempts.");
        } else {
          SetLoginError("Something went wrong, try again.");
        }
      }
    }
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
                <span>
                  <div className="verify-icon">
                    <MdOutlineEmail />
                  </div>
                  <h1>Verify your email</h1>
                  <span>
                    <p>We send a verification email to </p>
                    <span className="email">{signedUpEmail}</span>
                  </span>
                  <Button
                    className="resendBtn"
                    onClick={() => sendVerification()}
                  >
                    Resend
                  </Button>
                </span>
                <p>
                  Check your spam folder if you don't see it in a few minutes
                </p>
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
                  <form onSubmit={ResetPassword}>
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
