<script>
	// @ts-ignore
	import chartjs from 'chart.js';
	// @ts-ignore
	let chartData;
	import { onMount } from 'svelte';

	let chartValues = [20, 10, 5, 2, 20, 30, 45];
	let chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	let ctx;
	// @ts-ignore
	let chartCanvas;

	// @ts-ignore
	onMount(async (promise) => {
		  // @ts-ignore
		  ctx = chartCanvas.getContext('2d');
			// @ts-ignore
			var chart = new chartjs(ctx, {
				type: 'line',
				data: {
						labels: chartLabels,
						datasets: [{
								label: 'Revenue',
								backgroundColor: 'rgb(255, 99, 132)',
								borderColor: 'rgb(255, 99, 132)',
								data: chartValues
						}]
				}
		});

	});

</script>


<canvas bind:this={chartCanvas} id="myChart"></canvas>