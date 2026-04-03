// src/components/SideNavLayout/SideNavLayout.tsx
import {
    useHref,
    useLinkClickHandler,
    useLocation,
  } from "react-router-dom";
  import {
    DDSSideNav,
    DDSSideNavItem,
    DDSSideNavGroup,
  } from "@dds/react";
  import { useEffect, useState, useRef } from "react";
  
  const SideNavLayout = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const sideNavRef = useRef(null);
  
    useEffect(() => {
      switch (location.pathname) {
        case "/":
          setSelectedKey("i1-1");
          break;
        case "/2T":
          setSelectedKey("i1-2");
          break;
        case "/shortage-report":
          setSelectedKey("i2-1");
          break;
         case "/factory-log":
          setSelectedKey("i3-1");
          break;
           case "/issue-tracker":
          setSelectedKey("i4-1");
          break;
        default:
          setSelectedKey(null);
      }
    }, [location.pathname]);
  
    const handleSelectedItemChange = (id: string | null) => {
      setSelectedKey(id);
    };
  
    return (
        <div style={{ gridArea: "nav" }}>
        {/* @ts-expect-error asd */}
        <DDSSideNav style={{ top: "57px" }}
          fixed={true}
          selectedItem={selectedKey}
          onSelectedItemChange={handleSelectedItemChange}
          ref={sideNavRef}
        >
          <DDSSideNavGroup id="g1" icon="home" label="Overview">
            <DDSSideNavItem
              id="i1-1"
              icon="pie-chart"
              href={useHref("/")}
              onClick={useLinkClickHandler("/", {
                replace: false,
                state: undefined,
                target: "_self",
              })}
            >
              All Region
            </DDSSideNavItem>
            <DDSSideNavItem
              id="i1-2"
              icon="compare"
              href={useHref("/2T")}
              onClick={useLinkClickHandler("/2T", {
                replace: false,
                state: undefined,
                target: "_self",
              })}
            >
              2T
            </DDSSideNavItem>
          </DDSSideNavGroup>
          <DDSSideNavGroup id="g2" icon="toolbox" label="Shortage">
            <DDSSideNavItem
              id="i2-1"
              icon="stack"
              href={useHref("/shortage-report")}
              onClick={useLinkClickHandler("/shortage-report", {
                replace: false,
                state: undefined,
                target: "_self",
              })}
            >
              Shortage Report
            </DDSSideNavItem>
          </DDSSideNavGroup>
          <DDSSideNavGroup id="g3" icon="toolbox" label="Quality">
            <DDSSideNavItem
              id="i3-1"
              icon="stack"
              href={useHref("/factory-log")}
              onClick={useLinkClickHandler("/factory-log", {
                replace: false,
                state: undefined,
                target: "_self",
              })}
            >
              Factory Log Analysis Tool
            </DDSSideNavItem>
          </DDSSideNavGroup>
          <DDSSideNavGroup id="g4" icon="toolbox" label="IssueTracker">
            <DDSSideNavItem
              id="i4-1"
              icon="stack"
              href={useHref("/issue-tracker")}
              onClick={useLinkClickHandler("/issue-tracker", {
                replace: false,
                state: undefined,
                target: "_self",
              })}
            >
              GCS OWD Issue Tracker
            </DDSSideNavItem>
          </DDSSideNavGroup>
        </DDSSideNav>
      </div>
    );
  };
  
  export default SideNavLayout;
  