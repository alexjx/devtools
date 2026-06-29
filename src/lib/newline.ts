export function formatEscapedNewlines(input: string) {
  return input.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");
}
