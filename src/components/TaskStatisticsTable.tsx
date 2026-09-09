import React from "react";
import NotInMirror from "./NotInMirror";

/** 本家の private repo にしか無い部品。`NotInMirror` を見ること。 */
export function TaskStatisticsTable(): React.JSX.Element {
  return <NotInMirror name="TaskStatisticsTable" />;
}

// docs は名前付きでも default でも import している。両方出す。
export default TaskStatisticsTable;
