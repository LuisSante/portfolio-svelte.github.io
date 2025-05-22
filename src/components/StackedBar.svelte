<script>
    import * as d3 from "d3";

    export let data = []; 
    export let width = 600;
    export let selectedIndex = -1;
    export let hoveredIndex = -1;

    const barHeight = 50;
    const MIN_LABEL_WIDTH = 40;

    const colorMap = {
        js: "#597bbf",
        css: "#e59642",
        html: "#cd5c5c",
        svelte: "#97b5b6",
    };
    $: keys = data.map((d) => d[0]);

    $: dataForStack = [Object.fromEntries(data)];

    $: stackedData = d3.stack().keys(keys)(dataForStack);

    $: total =
        d3.max(stackedData, (series) => d3.max(series, (d) => d[1])) || 1;

    $: xScale = d3.scaleLinear().domain([0, total]).range([0, width]);

    $: colorScale = d3
        .scaleOrdinal()
        .domain(keys)
        .range(keys.map((key) => colorMap[key] || "gray"));
</script>

<svg {width} height={barHeight + 100}>
    {#each stackedData as series, i (series.key)}
        {#each series as d, j}
            <rect
                class:selected={selectedIndex === i}
                class:hovered={hoveredIndex === i}
                x={xScale(d[0])}
                y="0"
                width={xScale(d[1]) - xScale(d[0])}
                height={barHeight - 5}
                fill={colorScale(series.key)}
                rx="4"
                on:click={() => (selectedIndex = selectedIndex === i ? -1 : i)}
                on:mouseenter={() => (hoveredIndex = i)}
                on:mouseleave={() => (hoveredIndex = -1)}
                style="cursor: pointer;"
            />
            {#if xScale(d[1]) - xScale(d[0]) > MIN_LABEL_WIDTH}
                <text
                    class="label"
                    x={(xScale(d[0]) + xScale(d[1])) / 2}
                    y={barHeight / 2}
                    text-anchor="middle"
                    fill="white"
                    dominant-baseline="middle"
                    font-size="12"
                    font-weight="bold"
                >
                    {series.key}: {d[1] - d[0]}
                </text>
            {/if}
        {/each}
    {/each}

    <g transform={`translate(0, ${barHeight + 20})`}>
        <rect x="0" y="0" {width} height="50" stroke="black" fill="none" />
        {#each stackedData as series, i}
            <g transform={`translate(${i * (width / stackedData.length)}, 15)`}>
                <rect
                    width="14"
                    height="14"
                    fill={colorScale(series.key)}
                    class:selected={selectedIndex === i}
                    class:hovered={hoveredIndex === i}
                />
                <text x="18" y="12" font-size="12" fill="#333">
                    {series.key} ({series[0][1] - series[0][0]})
                </text>
            </g>
        {/each}
    </g>
</svg>

<style>
    .selected {
        stroke: #333;
        stroke-width: 2;
        opacity: 1;
    }

    .hovered {
        opacity: 0.8;
    }

    rect:not(.selected):not(.hovered) {
        opacity: 0.9;
    }

    .label {
        pointer-events: none;
    }
</style>
