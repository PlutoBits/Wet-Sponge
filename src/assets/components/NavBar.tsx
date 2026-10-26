import { NavLink } from "react-router-dom";
import { useState, useRef, type ToggleEvent } from "react";
import WetSponge from "../Wetsponge.webp";
import { Link } from "react-router-dom";
import { useProfile } from "../components/AccountContext";

function NavBar() {
  const [mode, setMode] = useState("all");
  const [searchInput, setSearch] = useState("");
  const { profileIcon } = useProfile();

  const handleSubmit = () => {
    window.location.reload();
  };

  const tabs = ["Home", "Manga", "Animation", "Music", "Cafe", "About"];
  const menuRef = useRef<HTMLDivElement>(null);
  function closeMenu() {
    menuRef.current?.hidePopover();
  }
  const PopoverLogic = (e: ToggleEvent<HTMLDivElement>) => {
    setOpen(e.currentTarget.matches(":popover-open"));
  };
  const [isMenuOpen, setOpen] = useState(false);
  if (mode === "all") {
    return (
      <>
        <div className="NavBar">
          <div className="first-child">
            <button
              className="hambar NavButton"
              onClick={() => {
                menuRef.current?.showPopover();
              }}
            >
              <i className="fa-solid fa-bars" />
            </button>
            <Link to={"/Home"} className="logo">
              <img
                className="LogoIcon"
                src={WetSponge}
                style={{ width: `44px`, height: `44px` }}
              ></img>
              <h1>WET SPONGE</h1>
            </Link>
          </div>

          <div className="second-Child">
            <div className="tabs">
              {tabs.map((tab) => (
                <NavLink
                  key={tab}
                  to={`/${tab}`}
                  className={({ isActive }) =>
                    isActive ? "Tabs Active" : "Tabs"
                  }
                >
                  {tab}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="third-child">
            <form onSubmit={handleSubmit} className="searchPill">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={searchInput}
                className="searchInput"
                placeholder="Search Wet Sponge.."
              ></input>
            </form>
            <button className="notification NavButton">
              <i className="fa-regular fa-bell"></i>
            </button>
            <button
              className="SearchInput-min"
              onClick={() => {
                setMode("search");
              }}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <NavLink className="ProfileChip" to={"/Account"}>
              {profileIcon}
            </NavLink>
          </div>
        </div>
        {isMenuOpen && <div className="barrier" onClick={closeMenu}></div>}
        <div
          popover="auto"
          id="SideBar"
          ref={menuRef}
          onToggle={(e) => PopoverLogic(e)}
        >
          <div className="second-Child popFirst-Child">
            <div className="sideBarTop">
              <button className="hambar NavButton" onClick={() => closeMenu()}>
                <i className="fa-solid fa-bars" />
              </button>
              <div className="logo">
                <h1>WET SPONGE</h1>
              </div>
            </div>
            {tabs.map((tab) => (
              <NavLink
                key={tab}
                to={`/${tab}`}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "Tabs Active popTabs" : "Tabs popTabs"
                }
              >
                {tab}
              </NavLink>
            ))}
          </div>
          <div className="popSecond-Child">
            <button className="notification NavButton popelement">
              <p>Notifications</p>
              <i className="fa-regular fa-bell"></i>
            </button>
          </div>
        </div>
      </>
    );
  } else if (mode === "search") {
    return (
      <div className="NavBar">
        <div className="first-child">
          <button
            onClick={() => {
              setMode("all");
            }}
            className="NavButton"
          >
            <i className="fa-solid fa-angle-left" />
          </button>
        </div>
        <div className="second-Child">
          <form
            onSubmit={handleSubmit}
            className="searchPill searchModeSearchBar"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={searchInput}
              className="searchInput"
              placeholder="Search Wet Sponge.."
            ></input>
          </form>
        </div>
      </div>
    );
  }
}

export default NavBar;
