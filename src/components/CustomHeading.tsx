import React from "react";
// import { HeadingProps } from "@types/mdx";

const CustomHeading = ({ as: Tag, children }: { as: React.ElementType; children: React.ReactNode }) => {
  const encode = (str: string) => {
    return str.replace(/[^\w]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
  };

  const encodedTitle =
    typeof children === "string"
      ? encode(children as string)
      : React.Children.toArray(children)
        .flatMap((c) => (React.isValidElement(c) && c.props?.children ? c.props.children : ""))
        .join("");

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          marginLeft: "-1.5em",
          fontWeight: 300,
          fontSize: "1.5rem",
          color: "#9b9b9b",
        }}
      >
        #
      </span>
      <Tag id={encodedTitle}>
        <a href={`#${encodedTitle}`}>{children}</a>
        <style jsx>{`
          a {
            color: inherit;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        `}</style>
      </Tag>
    </div>
  );
};

export default CustomHeading;