import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { STRUDEL_SYSTEM_GUIDE } from '$lib/strudel_guide';


export const POST: RequestHandler = async ({ request }) => {
	const { vibe, history } = await request.json();

	const messages = [{ role: 'system', content: STRUDEL_SYSTEM_GUIDE }];

	if (history && history.length > 0) {
		history.forEach((item) => {
			messages.push(
				{
					role: 'user',
					content: item.vibe
						? `Generate the next evolution. Use this vibe: ${item.vibe}`
						: `Generate the next evolution however you see fit.`
				},
				{ role: 'assistant', content: item.code }
			);
		});
	}

	messages.push({
		role: 'user',
		content: vibe
			? `Generate the next evolution. Use this vibe: ${vibe}`
			: `Generate the next evolution however you see fit.`
	});

	const response = await fetch('https://ai.hackclub.com/proxy/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.HACKCLUB_AI_KEY}`
		},
		body: JSON.stringify({
			model: 'google/gemini-3-pro-preview',
			messages: messages,
			temperature: 0.85,
			top_p: 0.95
		})
	});
    
    const data = await response.json();

    return json({ code: data.choices[0].message.content });
};
