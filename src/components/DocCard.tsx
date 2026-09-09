import React from "react";
import Link from "@docusaurus/Link";

/**
 * 本家の docs が最も多く使うリンクカード。**この fork で自前に用意したもの。**
 *
 * 本体は Windmill の private な docs repo にあり、公開 mirror には入っていない
 * (mirror の README がそう書いている)。docs/ の 401 本のうち 270 か所がこれを
 * import するので、これが無いとサイトは 1 ページも建たない。
 *
 * 見た目を寄せることは目指していない —— **読めること**が目的。props は実物の
 * 使われ方から採った: href / title / description が必須で、color / Icon / target
 * が任意 (401 本を走査した結果、それ以外は使われていない)。
 */
export interface DocCardProps {
  href: string;
  title: string;
  description?: string;
  /** 本家は色で分類しているが、ここでは左の罫線の色にだけ使う。 */
  color?: string;
  /** lucide-react のアイコン。渡されないこともある。 */
  Icon?: React.ComponentType<{ size?: number; className?: string }>;
  target?: string;
}

export default function DocCard({
  href,
  title,
  description,
  color,
  Icon,
  target,
}: DocCardProps): React.JSX.Element {
  return (
    <Link
      className="wm-doccard"
      to={href}
      {...(target === undefined ? {} : { target })}
      style={color === undefined ? undefined : { borderLeftColor: color }}
    >
      <div className="wm-doccard__head">
        {Icon === undefined ? null : <Icon size={18} className="wm-doccard__icon" />}
        <span className="wm-doccard__title">{title}</span>
      </div>
      {description === undefined ? null : (
        <p className="wm-doccard__desc">{description}</p>
      )}
    </Link>
  );
}
