import React from "react";
import LinkedIn from "../assets/linkedin-alt.svg";
import GitHub from "../assets/github-alt.svg";

export function SocialList({}) {
  return (
    <div>
      <a
        title="LinkedIn"
        href={`https://www.linkedin.com/in/bbarrows/}`}
        target="_blank"
        rel="noopener"
      >
        <LinkedIn width={24} height={24} fill={"#222"} />
      </a>
      <a
        title="GitHub"
        href={`https://github.com/bebrws/`}
        target="_blank"
        rel="noopener"
      >
        <GitHub width={24} height={24} fill={"#222"} />
      </a>
      <style jsx>{`
        a {
          display: inline-block;
        }
        a:not(:last-child) {
          margin-right: 2em;
        }
      `}</style>
    </div>
  );
}
