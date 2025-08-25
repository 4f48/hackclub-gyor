<script lang="ts">
	import { today } from "@internationalized/date";
	import { DateField, type WithoutChildrenOrChild } from "bits-ui";
</script>

<DateField.Root locale="hu" required>
	<div class="mb-4 grid focus-within:text-[#00ff00]">
		<DateField.Label>Születésnap</DateField.Label>
		<DateField.Input class="border p-1" id="birthday" name="birthday">
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<DateField.Segment
						class="focus-visible:bg-[#00ff00] focus-visible:text-black focus-visible:outline-none"
						{part}>{value}</DateField.Segment
					>
				{/each}
			{/snippet}
		</DateField.Input>
	</div>
</DateField.Root>
