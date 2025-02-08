<template>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" width="20" height="20">
        <g id="UrTavla">
            <circle cx="10" cy="10" r="10" stroke="gray" stroke-width="1" :fill="fill" />
            <text x="50%" y="50%" text-anchor="middle" stroke="black" stroke-width="1px" dy=".3em">{{text}}</text>
        </g>
    </svg>
</template>

<script>
    export default {
        props: {
            text: { 
                type: String, 
                default: "1"
            },
            fill: { 
                type: String, 
                default: "white"
            }
        }
    }
</script>
