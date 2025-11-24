<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	let editor = $state(null)

	onMount(async () => {
		// import only on client
		await import('@strudel/repl');

		const repl = document.createElement('strudel-editor');
		repl.setAttribute(
			'code',
			`setcps(1)
n("<0 1 2 3 4>*8").scale('G4 minor')
.s("gm_lead_6_voice")
.clip(sine.range(.2,.8).slow(8))
.jux(rev)
.room(2)
.sometimes(add(note("12")))
.lpf(perlin.range(200,20000).slow(4))`
		);
		document.getElementById('strudel').append(repl);
		editor = repl.editor;
	});

	$inspect(editor);
</script>

<div class="w-screen h-screen bg-cream flex items-center justify-center gap-10">
	<div class="bg-cream border border-beige p-8 text-center rounded-2xl">
		<button
			class=""
			onclick={() => { editor.evaluate(); editor.play() } }
		>play</button>
	</div>
	<div id="strudel" class="rounded-xl border border-beige"></div>
</div>
