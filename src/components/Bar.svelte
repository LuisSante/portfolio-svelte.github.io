<script>
  export let data = []; // [["js", 194], ["css", 251], ...]
  export let width = 600;
  const barHeight = 30;
  const barSpacing = 10;
  const height = data.length * (barHeight + barSpacing) + 300;

  const colorMap = {
    js: "#597bbf",
    css: "#e59642",
    html: "#cd5c5c",
    svelte: "#97b5b6",
  };

  $: maxVal = Math.max(...data.map((d) => d[1]));
</script>

<svg {width} {height} font-family="sans-serif">
  {#each data as [lang, val], i}
    <g transform={`translate(0, ${i * (barHeight + barSpacing)})`}>
      <rect
        x="0"
        y="0"
        height={barHeight}
        width={(val / maxVal) * width}
        fill={colorMap[lang] || "gray"}
        rx="4"
      />
      <text
        x={(val / maxVal) * width - 10}
        y={barHeight / 2 + 4}
        font-size="14"
        fill="white"
        text-anchor="end"
      >
        {lang}: {val}
      </text>
    </g>
  {/each}

  <g transform={`translate(0, ${data.length * (barHeight + barSpacing) + 20})`}>
    <rect x="0" y="0" {width} height="50" stroke="black" fill="none" />
    {#each data as [lang, val], i}
      <g transform={`translate(${i * (width / data.length)}, 15)`}>
        <rect width="14" height="14" fill={colorMap[lang] || "gray"} />
        <text x="18" y="12" font-size="12" fill="#333">
          {lang} ({val})
        </text>
      </g>
    {/each}
  </g>
</svg>
