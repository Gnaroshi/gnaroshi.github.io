import { useState } from "react";
import NavBtn from "./NavBtn.jsx";
import "./Nav.css";

export default function Nav({ handleNavBtnClick }) {
  const [selectedTab, setSelectedTab] = useState("home");

  function handleSelectTab(selectedTabButton) {
    handleNavBtnClick(selectedTabButton);
    setSelectedTab(selectedTabButton);
  }

  const tabs = [
    "home",
    "about",
    "research",
    "publication",
    "people",
    "photo",
    "contact",
  ];

  return (
    <div id="nav">
      {tabs.map((tab, i) => (
        <NavBtn
          key={tab + i}
          isSelected={selectedTab === tab}
          onSelect={() => handleSelectTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </NavBtn>
      ))}
    </div>
  );

  // return (
  //   <div id="nav">
  //     <NavBtn
  //       isSelected={selectedTab === "home"}
  //       onSelect={() => {
  //         handleSelectTab("home");
  //       }}
  //     >
  //       Home
  //     </NavBtn>
  //     <NavBtn
  //       isSelected={selectedTab === "about"}
  //       onSelect={() => {
  //         handleSelectTab("about");
  //       }}
  //     >
  //       About
  //     </NavBtn>
  //     <NavBtn
  //       isSelected={selectedTab === "research"}
  //       onSelect={() => {
  //         handleSelectTab("research");
  //       }}
  //     >
  //       Research
  //     </NavBtn>
  //     <NavBtn
  //       isSelected={selectedTab === "publication"}
  //       onSelect={() => {
  //         handleSelectTab("publication");
  //       }}
  //     >
  //       Publication
  //     </NavBtn>
  //     <NavBtn
  //       isSelected={selectedTab === "people"}
  //       onSelect={() => {
  //         handleSelectTab("people");
  //       }}
  //     >
  //       People
  //     </NavBtn>
  //     <NavBtn
  //       isSelected={selectedTab === "photo"}
  //       onSelect={() => {
  //         handleSelectTab("photo");
  //       }}
  //     >
  //       Photo
  //     </NavBtn>
  //     {/* <NavBtn */}
  //     {/*   isSelected={selectedTab === "join"} */}
  //     {/*   onSelect={() => { */}
  //     {/*     handleSelectTab("join"); */}
  //     {/*   }} */}
  //     {/* > */}
  //     {/*   Join */}
  //     {/* </NavBtn> */}
  //     <NavBtn
  //       isSelected={selectedTab === "contact"}
  //       onSelect={() => {
  //         handleSelectTab("contact");
  //       }}
  //     >
  //       Contact
  //     </NavBtn>
  //   </div>
  // );
  // return (
  //   <nav>
  //     <NavBtn label="" onSelect={() => handleSelectTab("Home")}>
  //       Home
  //     </NavBtn>
  //     <NavBtn label="" onSelect={() => handleSelectTab("About")}>
  //       About
  //     </NavBtn>
  //     <NavBtn label="" onSelect={() => handleSelectTab("Research")}>
  //       Research
  //     </NavBtn>
  //     <NavBtn label="" onSelect={() => handleSelectTab("People")}>
  //       People
  //     </NavBtn>
  //     <NavBtn label="" onSelect={() => handleSelectTab("Photo")}>
  //       Photo
  //     </NavBtn>
  //     <NavBtn label="" onSelect={() => handleSelectTab("Join")}>
  //       Join
  //     </NavBtn>
  //     <NavBtn label="" onSelect={() => handleSelectTab("Contact")}>
  //       Contact
  //     </NavBtn>
  //   </nav>
  // );
}
