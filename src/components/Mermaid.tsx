import { useEffect, useState } from "react";

type Props = {
  chart: string;
  title: string;
};

let diagramNumber = 0;
let mermaidConfigured = false;
let renderQueue = Promise.resolve();

function queueRender<T>(render: () => Promise<T>): Promise<T> {
  const nextRender = renderQueue.then(render, render);
  renderQueue = nextRender.then(
    () => undefined,
    () => undefined
  );
  return nextRender;
}

export default function Mermaid({ chart, title }: Props) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    queueRender(async () => {
      const { default: mermaid } = await import("mermaid");

      if (!mermaidConfigured) {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
          fontFamily: "Ubuntu, sans-serif",
          flowchart: {
            curve: "linear",
            htmlLabels: true,
            useMaxWidth: true,
          },
        });
        mermaidConfigured = true;
      }

      return mermaid.renderAsync(
        `mermaid-diagram-${++diagramNumber}`,
        chart.trim()
      );
    })
      .then((renderedSvg) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      })
      .catch((renderError) => {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Unable to render this diagram."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <figure className="mermaid-figure">
      {error ? (
        <div className="mermaid-error" role="alert">
          <strong>{title}</strong>
          <pre>{chart.trim()}</pre>
          <p>{error}</p>
        </div>
      ) : (
        <div
          aria-label={title}
          className="mermaid-diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
          role="img"
        />
      )}
      <figcaption>{title}</figcaption>

      <style jsx>{`
        .mermaid-figure {
          margin: 2rem 0;
        }

        .mermaid-diagram {
          min-height: 12rem;
          overflow-x: auto;
          text-align: center;
        }

        .mermaid-error {
          border: 1px solid #d73a49;
          border-radius: 0.25rem;
          padding: 1rem;
        }

        .mermaid-error pre {
          overflow-x: auto;
          white-space: pre;
        }

        figcaption {
          color: #6a737d;
          font-size: 0.9rem;
          margin-top: 0.75rem;
          text-align: center;
        }
      `}</style>
      <style global jsx>{`
        .mermaid-diagram svg {
          height: auto;
          max-width: 100%;
        }
      `}</style>
    </figure>
  );
}
