<script>
	import { onMount } from 'svelte';

	let editor = $state(null);
	let playing = $state(false);
	let timeToUpdate = $state(67);
	let history = $state([]);
	let vibe = $state('');

	async function generateNext() {
		let savedVibe = vibe

		const res = await fetch('/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				vibe: vibe,
				history: history,
			})
		});
		console.log("got response!")

		

		let data = await res.json()

		history.push({
			vibe: savedVibe,
			code: data.code
		})

		// play the code with strudel
		updateStrudel(data.code);
	}

	function updateStrudel(code) {
		editor.setCode(code)

		editor.evaluate()
	}

	onMount(async () => {
		// import only on client
		await import('@strudel/repl');

		const repl = document.createElement('strudel-editor');

		repl.setAttribute(
			'code',
			``
		);
		document.getElementById('strudel').append(repl);
		editor = repl.editor;
	});

	function play() {
		playing = true;

		editor.evaluate();
	}

	$inspect(editor);
</script>

<div class="w-screen h-screen bg-cream flex text-dark items-center justify-center gap-10">
	{#if playing}
		<div class="bg-cream border border-beige p-8 text-center rounded-2xl flex flex-col gap-4">
			<button class="rounded-2xl p-4 px-6 bg-beige" onclick={generateNext}>update now (next in {timeToUpdate}s)</button>
			<input
				class="rounded-2xl w-full p-3 border border-beige"
				placeholder="enter a vibe..."
				bind:value={vibe}
			/>
		</div>
	{:else}
		<button class="bg-cream border border-beige p-4 px-6 text-center rounded-2xl" onclick={play}
			>play</button
		>
	{/if}

	<div id="strudel" class="rounded-xl border border-beige hidden"></div>
</div>
