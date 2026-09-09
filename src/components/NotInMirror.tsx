import React from "react";

/**
 * 本家の private repo にしか無い、対話的な図やベンチマークの代わり。
 *
 * **黙って空白にしない。** 空白のまま出すと、読み手は「日本語訳が抜けている」と
 * 誤解する。ここに在るはずのものが**この fork には存在しない**こと、そして
 * 本家で見られることを、その場で言う。
 *
 * 対象は 9 つ (EngineBenchmarks / BenchmarkVisualization / TaskStatisticsTable /
 * TaskDurationBarChart / WorkerQueueSimulator / VideoTour / ScatterChart /
 * FlowEngineSimulator と、mdx の TpcDsBenchmarkSection)。合計 22 か所で、
 * どれもベンチマークか動画の埋め込み。
 */
export default function NotInMirror({ name }: { name: string }): React.JSX.Element {
  return (
    <div className="wm-not-in-mirror">
      <strong>{name}</strong> はこの fork では表示できません。
      <br />
      本家のドキュメントサイトが private な repo に置いている対話的な部品で、
      公開 mirror には含まれていないためです。
      <a href="https://www.windmill.dev/docs/intro" target="_blank" rel="noreferrer">
        本家のドキュメント
      </a>
      で見られます。
    </div>
  );
}
