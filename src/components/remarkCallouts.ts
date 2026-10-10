interface Node {
  type: string;
  value?: string;
  children?: Node[];
  data?: { hProperties?: Record<string, unknown> };
}
/** Convert authored GFM-style admonitions without enabling arbitrary HTML. */
export function remarkCallouts() {
  return (tree: Node) => {
    const walk = (node: Node) => {
      if (node.type === "blockquote") {
        const first = node.children?.[0]?.children?.[0];
        const match = first?.value?.match(
          /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/,
        );
        if (match && first) {
          first.value = first.value!.replace(match[0], match[1] + ": ");
          node.data = {
            ...node.data,
            hProperties: {
              ...node.data?.hProperties,
              className: [
                "markdown-callout",
                `callout-${match[1].toLowerCase()}`,
              ],
            },
          };
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
