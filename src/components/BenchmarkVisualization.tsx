import React from "react";
import NotInMirror from "./NotInMirror";

/** 本家の private repo にしか無い部品。`NotInMirror` を見ること。 */
export function BenchmarkVisualization(): React.JSX.Element {
  return <NotInMirror name="BenchmarkVisualization" />;
}

// docs は名前付きでも default でも import している。両方出す。
export default BenchmarkVisualization;
