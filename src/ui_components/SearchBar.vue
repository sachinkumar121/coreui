<template>
    <div>
        <div class="search-box">
            <div class="">
                <input class="input-center-search form-control" placeholder="Search" value="">
                <div class="input-search-content position-absolute search-result">
                    <p class="section-title">Results</p>
                    <p class="mb-1">Booking Result</p>
                    <p class="mb-1">Booking Result</p>
                    <p class="mb-1">Booking Result</p>
                    <p class="mb-1">Booking Result</p>
                </div>
            </div>
            
            <svg class="Icon MagnifyerIcon" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M29.707,28.293l-8.256-8.256C23.042,18.13,24,15.677,24,13c0-6.075-4.925-11-11-11S2,6.925,2,13s4.925,11,11,11c2.677,0,5.13-0.958,7.037-2.549l8.256,8.256L29.707,28.293z M4,13c0-4.963,4.037-9,9-9c4.963,0,9,4.037,9,9s-4.037,9-9,9C8.037,22,4,17.963,4,13z"></path></svg>
            <span class="keyboard-icon-wrap" aria-hidden="true">
                <span class="keyboard-shortcut-icon">Ctrl</span>
                <span class="keyboard-shortcut-icon">K</span>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SearchBar',
}
</script>
